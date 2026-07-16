import { NextResponse } from "next/server";
import { createOtp, verifyAdminPhone } from "@/lib/admin-credentials";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const body = (await req.json()) as { phone?: string };
  if (!body.phone) {
    return NextResponse.json({ error: "Phone required" }, { status: 400 });
  }

  const matches = await verifyAdminPhone(body.phone);
  if (!matches) {
    return NextResponse.json(
      { ok: true, message: "If this number is registered, an OTP was sent." },
      { status: 200 },
    );
  }

  try {
    const result = await createOtp(body.phone);
    const hasSms =
      Boolean(process.env.CALLMEBOT_APIKEY) || Boolean(process.env.FAST2SMS_API_KEY);

    // Without SMS provider, return OTP in response so password reset still works on Vercel.
    // (Only returned after phone match — still keep phone private.)
    return NextResponse.json({
      ok: true,
      message: hasSms
        ? "OTP sent to your registered number."
        : "OTP generated. No SMS API configured — use the code shown below.",
      ...(hasSms ? {} : { otp: result.code }),
      expiresAt: result.expiresAt,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Could not create OTP";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
