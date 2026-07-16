import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { isAdminAuthenticated } from "@/lib/admin-auth";

export async function POST(req: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const form = await req.formData();
  const file = form.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file" }, { status: 400 });
  }

  const bytes = Buffer.from(await file.arrayBuffer());
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
  const stamp = Date.now();
  const rel = `/media/uploads/${stamp}-${safeName}`;
  const abs = path.join(process.cwd(), "public", "media", "uploads", `${stamp}-${safeName}`);
  await fs.mkdir(path.dirname(abs), { recursive: true });
  await fs.writeFile(abs, bytes);

  return NextResponse.json({ url: rel });
}
