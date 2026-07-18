import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { put, del } from "@vercel/blob";
import { isVercelRuntime } from "@/lib/kv-store";

export const dynamic = "force-dynamic";

const MAX_UPLOAD_BYTES = 8 * 1024 * 1024; // 8 MB

export async function POST(req: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const form = await req.formData();
  const file = form.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file" }, { status: 400 });
  }
  if (!file.type.startsWith("image/")) {
    return NextResponse.json(
      { error: "Only image files are allowed." },
      { status: 400 },
    );
  }
  if (file.size > MAX_UPLOAD_BYTES) {
    return NextResponse.json(
      { error: "Image is larger than 8 MB. Please use a smaller photo." },
      { status: 413 },
    );
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

/** Deletes a previously uploaded file (Vercel Blob or local public/media/uploads). */
export async function DELETE(req: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await req.json().catch(() => ({}))) as { url?: string };
  const url = body.url;
  if (!url || typeof url !== "string") {
    return NextResponse.json({ error: "No url" }, { status: 400 });
  }

  // Vercel Blob file
  if (url.includes(".blob.vercel-storage.com")) {
    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      return NextResponse.json({ error: "Blob not configured" }, { status: 503 });
    }
    try {
      await del(url, { token: process.env.BLOB_READ_WRITE_TOKEN });
      return NextResponse.json({ ok: true });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Delete failed";
      return NextResponse.json({ error: message }, { status: 500 });
    }
  }

  // Local uploaded file — only allow deleting inside public/media/uploads
  if (url.startsWith("/media/uploads/") && !isVercelRuntime()) {
    const uploadsDir = path.join(process.cwd(), "public", "media", "uploads");
    const abs = path.resolve(path.join(process.cwd(), "public", url));
    if (!abs.startsWith(uploadsDir + path.sep)) {
      return NextResponse.json({ error: "Invalid path" }, { status: 400 });
    }
    await fs.unlink(abs).catch(() => undefined);
    return NextResponse.json({ ok: true });
  }

  // Bundled assets (e.g. /media/profile/anshul.jpg) are never deleted.
  return NextResponse.json({ ok: true, skipped: true });
}
