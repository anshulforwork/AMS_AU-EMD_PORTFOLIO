import { put, type PutBlobResult } from "@vercel/blob";

type Access = "public" | "private";

/**
 * Upload to Vercel Blob. Tries public first (best for portfolio images);
 * if the connected store is private, retries with access: "private".
 */
export async function putPortfolioBlob(
  pathname: string,
  bytes: Buffer,
  contentType: string,
): Promise<{ blob: PutBlobResult; access: Access }> {
  const token = process.env.BLOB_READ_WRITE_TOKEN;
  if (!token) {
    throw new Error("Missing BLOB_READ_WRITE_TOKEN");
  }

  const base = {
    contentType: contentType || "application/octet-stream",
    addRandomSuffix: false,
    token,
  } as const;

  try {
    const blob = await put(pathname, bytes, { ...base, access: "public" });
    return { blob, access: "public" };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    const isPrivateStore =
      /private store/i.test(message) ||
      /public access/i.test(message) ||
      /access.*private/i.test(message);
    if (!isPrivateStore) throw err;

    const blob = await put(pathname, bytes, { ...base, access: "private" });
    return { blob, access: "private" };
  }
}

/**
 * Public stores return a direct CDN URL.
 * Private stores need our /api/media proxy so <img> / next/image can load them.
 */
export function blobDisplayUrl(pathname: string, blob: PutBlobResult, access: Access) {
  if (access === "public" && !blob.url.includes(".private.blob.")) {
    return blob.url;
  }
  // pathname: media/uploads/123-photo.jpg → /api/media/uploads/123-photo.jpg
  const relative = pathname.replace(/^media\//, "");
  return `/api/media/${relative}`;
}

/** Convert a stored display URL into the blob pathname for delete/get. */
export function blobPathnameFromUrl(url: string): string | null {
  if (url.startsWith("/api/media/")) {
    return `media/${url.slice("/api/media/".length)}`;
  }
  if (url.includes(".blob.vercel-storage.com/")) {
    try {
      const u = new URL(url);
      return u.pathname.replace(/^\//, "");
    } catch {
      return null;
    }
  }
  return null;
}
