import { NextResponse } from "next/server";
import {
  setPassword,
  verifyAdminPhone,
  verifyOtp,
} from "@/lib/admin-credentials";

export async function POST(req: Request) {
  const body = (await req.json()) as {
    phone?: string;
    otp?: string;
    newPassword?: string;
  };

  if (!body.phone || !body.otp || !body.newPassword) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  if (body.newPassword.length < 8) {
    return NextResponse.json(
      { error: "Password must be at least 8 characters" },
      { status: 400 },
    );
  }

  if (!(await verifyAdminPhone(body.phone))) {
    return NextResponse.json({ error: "Invalid phone or OTP" }, { status: 401 });
  }

  if (!(await verifyOtp(body.phone, body.otp))) {
    return NextResponse.json({ error: "Invalid phone or OTP" }, { status: 401 });
  }

  await setPassword(body.newPassword);
  return NextResponse.json({ ok: true, message: "Password updated" });
}
