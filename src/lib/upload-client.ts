"use client";

/**
 * Shared client-side upload helpers for the admin panel.
 *
 * Large photos (phone camera images are often 5–12 MB) exceed Vercel's
 * 4.5 MB request body limit and fail before the API route even runs.
 * To avoid that, images are downscaled/compressed in the browser first.
 */

const MAX_DIMENSION = 1920;
const COMPRESS_THRESHOLD = 1.5 * 1024 * 1024; // compress anything above 1.5 MB
const COMPRESSIBLE = ["image/jpeg", "image/png", "image/webp"];

async function compressImage(file: File): Promise<File> {
  if (!COMPRESSIBLE.includes(file.type) || file.size <= COMPRESS_THRESHOLD) {
    return file;
  }
  try {
    const bitmap = await createImageBitmap(file);
    const scale = Math.min(1, MAX_DIMENSION / Math.max(bitmap.width, bitmap.height));
    const width = Math.max(1, Math.round(bitmap.width * scale));
    const height = Math.max(1, Math.round(bitmap.height * scale));

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) return file;
    ctx.drawImage(bitmap, 0, 0, width, height);
    bitmap.close();

    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, "image/jpeg", 0.85),
    );
    if (!blob || blob.size >= file.size) return file;

    const name = file.name.replace(/\.[^.]+$/, "") + ".jpg";
    return new File([blob], name, { type: "image/jpeg" });
  } catch {
    return file;
  }
}

export type UploadResult = { url: string; error?: never } | { url?: never; error: string };

export async function uploadImage(file: File): Promise<UploadResult> {
  if (!file.type.startsWith("image/")) {
    return { error: "Only image files can be uploaded here." };
  }

  const prepared = await compressImage(file);

  const form = new FormData();
  form.append("file", prepared);

  let res: Response;
  try {
    res = await fetch("/api/admin/upload", { method: "POST", body: form });
  } catch {
    return { error: "Network error — check your connection and try again." };
  }

  if (res.status === 401) {
    return { error: "Session expired. Please log in again." };
  }
  if (res.status === 413) {
    return { error: "Image is too large for the server. Try a smaller photo." };
  }

  const json = (await res.json().catch(() => ({}))) as { url?: string; error?: string };
  if (!res.ok || !json.url) {
    return { error: json.error || `Upload failed (HTTP ${res.status}). Try again.` };
  }
  return { url: json.url };
}

/** True when the URL points at a file the admin uploaded (safe to delete). */
export function isUploadedFile(url: string | undefined): boolean {
  if (!url) return false;
  return (
    url.includes("/media/uploads/") ||
    url.startsWith("/api/media/") ||
    url.includes(".blob.vercel-storage.com")
  );
}

/** Best-effort delete of an uploaded file from storage. Never throws. */
export async function deleteUploadedImage(url: string | undefined): Promise<void> {
  if (!isUploadedFile(url)) return;
  await fetch("/api/admin/upload", {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url }),
  }).catch(() => undefined);
}
