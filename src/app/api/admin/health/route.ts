import { NextResponse } from "next/server";
import { hasPersistentStore, getStorageSetupHint, isVercelRuntime } from "@/lib/kv-store";

export const dynamic = "force-dynamic";

/** Quick check for Admin/storage setup on the live site */
export async function GET() {
  const redis = hasPersistentStore();
  const blob = Boolean(process.env.BLOB_READ_WRITE_TOKEN);
  const ok = isVercelRuntime() ? redis : true;

  return NextResponse.json({
    ok,
    vercel: isVercelRuntime(),
    redisConfigured: redis,
    blobConfigured: blob,
    hint: redis ? null : getStorageSetupHint(),
  });
}
