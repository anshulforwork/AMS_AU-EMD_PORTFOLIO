import { NextResponse } from "next/server";
import {
  ADMIN_COOKIE,
  getAdminPassword,
  makeAdminToken,
} from "@/lib/admin-auth";

export async function POST(req: Request) {
  const body = (await req.json()) as { password?: string };
  if (!body.password || body.password !== getAdminPassword()) {
    return NextResponse.json({ error: "Invalid password" }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set(ADMIN_COOKIE, makeAdminToken(), {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
  return res;
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set(ADMIN_COOKIE, "", { httpOnly: true, path: "/", maxAge: 0 });
  return res;
}
