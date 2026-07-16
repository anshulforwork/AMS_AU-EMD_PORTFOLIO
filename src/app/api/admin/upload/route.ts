import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { put } from "@vercel/blob";
import { isVercelRuntime } from "@/lib/kv-store";

export const dynamic = "force-dynamic";

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

  if (process.env.BLOB_READ_WRITE_TOKEN) {
    try {
      const blob = await put(`media/uploads/${stamp}-${safeName}`, bytes, {
        access: "public",
        contentType: file.type || "application/octet-stream",
        addRandomSuffix: false,
        token: process.env.BLOB_READ_WRITE_TOKEN,
      });
      return NextResponse.json({ url: blob.url });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Upload failed";
      return NextResponse.json({ error: message }, { status: 500 });
    }
  }

  if (isVercelRuntime()) {
    return NextResponse.json(
      {
        error:
          "Missing BLOB_READ_WRITE_TOKEN. In Vercel → Storage → Blob → connect to this project (or copy the token into Environment Variables), then Redeploy.",
      },
      { status: 503 },
    );
  }

  const abs = path.join(process.cwd(), "public", "media", "uploads", `${stamp}-${safeName}`);
  await fs.mkdir(path.dirname(abs), { recursive: true });
  await fs.writeFile(abs, bytes);

  return NextResponse.json({ url: rel });
}
