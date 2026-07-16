import { NextResponse } from "next/server";
import { createOtp, verifyAdminPhone } from "@/lib/admin-credentials";

export async function POST(req: Request) {
  const body = (await req.json()) as { phone?: string };
  if (!body.phone) {
    return NextResponse.json({ error: "Phone required" }, { status: 400 });
  }

  // Always same response shape to avoid phone enumeration timing leaks in UI
  const matches = await verifyAdminPhone(body.phone);
  if (!matches) {
    return NextResponse.json(
      { ok: true, message: "If this number is registered, an OTP was sent." },
      { status: 200 },
    );
  }

  await createOtp(body.phone);
  return NextResponse.json({
    ok: true,
    message: "OTP sent to your registered number.",
  });
}
