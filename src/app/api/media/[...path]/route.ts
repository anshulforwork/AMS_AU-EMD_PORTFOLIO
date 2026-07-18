import { NextResponse } from "next/server";
import { get } from "@vercel/blob";

export const dynamic = "force-dynamic";

/**
 * Streams portfolio images from a private Vercel Blob store.
 * Uploads store paths like /api/media/uploads/123-photo.jpg which map to
 * blob pathname media/uploads/123-photo.jpg.
 *
 * No admin auth — these are the public-facing portfolio images.
 */
export async function GET(
  req: Request,
  ctx: { params: Promise<{ path: string[] }> },
) {
  const { path } = await ctx.params;
  if (!path?.length) {
    return NextResponse.json({ error: "Missing path" }, { status: 400 });
  }

  // Only serve files under media/uploads (never arbitrary store paths)
  if (path[0] !== "uploads") {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const pathname = `media/${path.join("/")}`;
  const token = process.env.BLOB_READ_WRITE_TOKEN;
  if (!token) {
    return NextResponse.json({ error: "Blob not configured" }, { status: 503 });
  }

  try {
    const result = await get(pathname, {
      access: "private",
      token,
      ifNoneMatch: req.headers.get("if-none-match") ?? undefined,
    });

    if (!result) {
      return new NextResponse("Not found", { status: 404 });
    }

    if (result.statusCode === 304) {
      return new NextResponse(null, {
        status: 304,
        headers: {
          ETag: result.blob.etag,
          "Cache-Control": "public, max-age=31536000, immutable",
        },
      });
    }

    return new NextResponse(result.stream, {
      headers: {
        "Content-Type": result.blob.contentType || "application/octet-stream",
        "X-Content-Type-Options": "nosniff",
        ETag: result.blob.etag,
        // Portfolio media is meant to be publicly viewable on the site
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Fetch failed";
    console.error("[api/media]", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
