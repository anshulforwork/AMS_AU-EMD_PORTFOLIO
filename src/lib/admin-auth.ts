import { cookies } from "next/headers";
import { createHmac, timingSafeEqual } from "crypto";

const COOKIE = "ams_admin";

export function getAdminPassword() {
  return process.env.ADMIN_PASSWORD || "anshul123";
}

function sign(value: string) {
  const secret = process.env.ADMIN_SECRET || "ams-portfolio-secret";
  return createHmac("sha256", secret).update(value).digest("hex");
}

export function makeAdminToken() {
  const payload = `ok:${Date.now()}`;
  return `${payload}.${sign(payload)}`;
}

export function verifyAdminToken(token: string | undefined) {
  if (!token) return false;
  const [payload, sig] = token.split(".");
  if (!payload || !sig) return false;
  const expected = sign(payload);
  try {
    return timingSafeEqual(Buffer.from(sig), Buffer.from(expected));
  } catch {
    return false;
  }
}

export async function isAdminAuthenticated() {
  const jar = await cookies();
  return verifyAdminToken(jar.get(COOKIE)?.value);
}

export { COOKIE as ADMIN_COOKIE };
