import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { put } from "@vercel/blob";

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

  // If running on Vercel with Blob configured, store uploads persistently.
  if (process.env.BLOB_READ_WRITE_TOKEN) {
    const blob = await put(`media/uploads/${stamp}-${safeName}`, bytes, {
      access: "public",
      contentType: file.type || "application/octet-stream",
      addRandomSuffix: false,
    });
    return NextResponse.json({ url: blob.url });
  }

  // Local dev fallback: write into /public so next/image can serve it.
  const abs = path.join(process.cwd(), "public", "media", "uploads", `${stamp}-${safeName}`);
  await fs.mkdir(path.dirname(abs), { recursive: true });
  await fs.writeFile(abs, bytes);

  return NextResponse.json({ url: rel });
}
