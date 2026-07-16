import { promises as fs } from "fs";
import path from "path";
import { randomBytes, scryptSync, timingSafeEqual } from "crypto";
import { getKvClient, isVercelRuntime } from "@/lib/kv-store";

export type AdminCredentials = {
  phone: string;
  salt: string;
  passwordHash: string;
};

const DATA_PATH = path.join(process.cwd(), "data", "admin.json");
const OTP_PATH = path.join(process.cwd(), "data", "admin-otp.json");
const OTP_DEBUG_PATH = path.join(process.cwd(), "data", ".otp-latest.txt");
const KV_CREDS_KEY = "ams:admin:creds";
const KV_OTP_KEY = "ams:admin:otp";

/** Seed credentials (hash only — never plaintext in repo). Phone: 7067532499 */
const SEED: AdminCredentials = {
  phone: "7067532499",
  salt: "77b2cedd04767655589299ed2296ca90",
  passwordHash:
    "c769bdf181b2315189202cdb01319a4598fb1faaf4756c8ad26a73622356e169e7bf25aba9104b9a440dad6cafb8b33a6a2ced6843cb9ad8ad45891707d8ddb8",
};

type OtpRecord = {
  codeHash: string;
  salt: string;
  expiresAt: number;
  phone: string;
  purpose: "change-password";
};

function hashWithSalt(value: string, salt: string) {
  return scryptSync(value, salt, 64).toString("hex");
}

function safeEqualHex(a: string, b: string) {
  try {
    const ba = Buffer.from(a, "hex");
    const bb = Buffer.from(b, "hex");
    if (ba.length !== bb.length) return false;
    return timingSafeEqual(ba, bb);
  } catch {
    return false;
  }
}

export async function getCredentials(): Promise<AdminCredentials> {
  const kv = getKvClient();
  if (kv) {
    const stored = (await kv.get(KV_CREDS_KEY)) as AdminCredentials | null;
    if (stored?.phone && stored?.salt && stored?.passwordHash) return stored;
    let seed = SEED;
    try {
      const raw = await fs.readFile(DATA_PATH, "utf8");
      const parsed = JSON.parse(raw) as AdminCredentials;
      if (parsed.phone && parsed.salt && parsed.passwordHash) seed = parsed;
    } catch {
      /* ignore */
    }
    await kv.set(KV_CREDS_KEY, seed);
    return seed;
  }
  try {
    const raw = await fs.readFile(DATA_PATH, "utf8");
    const parsed = JSON.parse(raw) as AdminCredentials;
    if (parsed.phone && parsed.salt && parsed.passwordHash) return parsed;
  } catch {
    /* use seed */
  }
  return SEED;
}

export async function saveCredentials(creds: AdminCredentials) {
  const kv = getKvClient();
  if (kv) {
    await kv.set(KV_CREDS_KEY, creds);
    return;
  }
  if (isVercelRuntime()) {
    throw new Error("Cannot save admin credentials without Redis REST env vars on Vercel.");
  }
  await fs.mkdir(path.dirname(DATA_PATH), { recursive: true });
  await fs.writeFile(DATA_PATH, JSON.stringify(creds, null, 2), "utf8");
}

export async function verifyPassword(password: string) {
  const creds = await getCredentials();
  const hash = hashWithSalt(password, creds.salt);
  return safeEqualHex(hash, creds.passwordHash);
}

export function normalizePhone(input: string) {
  const digits = input.replace(/\D/g, "");
  if (digits.length === 12 && digits.startsWith("91")) return digits.slice(2);
  if (digits.length === 11 && digits.startsWith("0")) return digits.slice(1);
  return digits;
}

export async function verifyAdminPhone(phone: string) {
  const creds = await getCredentials();
  return normalizePhone(phone) === normalizePhone(creds.phone);
}

export async function setPassword(newPassword: string) {
  const creds = await getCredentials();
  const salt = randomBytes(16).toString("hex");
  const passwordHash = hashWithSalt(newPassword, salt);
  await saveCredentials({ ...creds, salt, passwordHash });
}

export async function setAdminPhone(phone: string) {
  const creds = await getCredentials();
  await saveCredentials({ ...creds, phone: normalizePhone(phone) });
}

export async function createOtp(phone: string) {
  const code = String(Math.floor(100000 + Math.random() * 900000));
  const salt = randomBytes(8).toString("hex");
  const record: OtpRecord = {
    codeHash: hashWithSalt(code, salt),
    salt,
    expiresAt: Date.now() + 10 * 60 * 1000,
    phone: normalizePhone(phone),
    purpose: "change-password",
  };
  const kv = getKvClient();
  if (kv) {
    await kv.set(KV_OTP_KEY, record);
  } else if (!isVercelRuntime()) {
    await fs.mkdir(path.dirname(OTP_PATH), { recursive: true });
    await fs.writeFile(OTP_PATH, JSON.stringify(record), "utf8");
  } else {
    throw new Error("OTP storage requires Redis REST env vars on Vercel.");
  }

  await deliverOtp(record.phone, code);
  return { expiresAt: record.expiresAt, code };
}

async function deliverOtp(phone: string, code: string) {
  const message = `AMS Portfolio admin OTP: ${code}. Valid for 10 minutes.`;
  const callmebot = process.env.CALLMEBOT_APIKEY;
  const fast2sms = process.env.FAST2SMS_API_KEY;

  if (callmebot) {
    const url = `https://api.callmebot.com/whatsapp.php?phone=91${phone}&text=${encodeURIComponent(message)}&apikey=${callmebot}`;
    await fetch(url).catch(() => undefined);
  } else if (fast2sms) {
    await fetch("https://www.fast2sms.com/dev/bulkV2", {
      method: "POST",
      headers: {
        authorization: fast2sms,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        route: "q",
        message,
        language: "english",
        flash: 0,
        numbers: phone,
      }),
    }).catch(() => undefined);
  }

  // Local fallback only — never crash Vercel on read-only FS
  if (!isVercelRuntime()) {
    try {
      await fs.writeFile(
        OTP_DEBUG_PATH,
        `${message}\nPhone: ${phone}\nCreated: ${new Date().toISOString()}\n`,
        "utf8",
      );
    } catch {
      /* ignore */
    }
  }
  console.log(`[AMS OTP] Generated for ****${phone.slice(-4)}`);
}

export async function verifyOtp(phone: string, otp: string) {
  const kv = getKvClient();
  if (kv) {
    const record = (await kv.get(KV_OTP_KEY)) as OtpRecord | null;
    if (!record) return false;
    if (Date.now() > record.expiresAt) return false;
    if (normalizePhone(phone) !== record.phone) return false;
    const hash = hashWithSalt(otp.trim(), record.salt);
    const ok = safeEqualHex(hash, record.codeHash);
    if (ok) {
      await kv.del(KV_OTP_KEY);
    }
    return ok;
  }
  try {
    const raw = await fs.readFile(OTP_PATH, "utf8");
    const record = JSON.parse(raw) as OtpRecord;
    if (Date.now() > record.expiresAt) return false;
    if (normalizePhone(phone) !== record.phone) return false;
    const hash = hashWithSalt(otp.trim(), record.salt);
    const ok = safeEqualHex(hash, record.codeHash);
    if (ok) {
      await fs.unlink(OTP_PATH).catch(() => undefined);
      await fs.unlink(OTP_DEBUG_PATH).catch(() => undefined);
    }
    return ok;
  } catch {
    return false;
  }
}
