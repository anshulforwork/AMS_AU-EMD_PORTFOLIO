import { createClient, type VercelKV } from "@vercel/kv";

export type KvLike = Pick<VercelKV, "get" | "set" | "del">;

/**
 * Supports Vercel KV + Upstash Redis env names that Vercel may inject:
 * - KV_REST_API_URL / KV_REST_API_TOKEN
 * - UPSTASH_REDIS_REST_URL / UPSTASH_REDIS_REST_TOKEN
 */
export function getRedisRestConfig(): { url: string; token: string } | null {
  const url =
    process.env.KV_REST_API_URL ||
    process.env.UPSTASH_REDIS_REST_URL ||
    process.env.REDIS_REST_URL;
  const token =
    process.env.KV_REST_API_TOKEN ||
    process.env.UPSTASH_REDIS_REST_TOKEN ||
    process.env.REDIS_REST_TOKEN;

  if (url && token) return { url, token };
  return null;
}

export function hasPersistentStore() {
  return Boolean(getRedisRestConfig());
}

export function getStorageSetupHint() {
  return (
    "Missing Redis REST credentials. In Vercel → Storage → your Redis → open .env / REST API, " +
    "copy UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN, then add them in " +
    "Project → Settings → Environment Variables as KV_REST_API_URL and KV_REST_API_TOKEN " +
    "(or keep the UPSTASH_ names). Redeploy after saving."
  );
}

let cached: KvLike | null | undefined;

export function getKvClient(): KvLike | null {
  if (cached !== undefined) return cached;

  const cfg = getRedisRestConfig();
  if (!cfg) {
    cached = null;
    return null;
  }

  try {
    cached = createClient({
      url: cfg.url,
      token: cfg.token,
    });
    return cached;
  } catch {
    cached = null;
    return null;
  }
}

export function isVercelRuntime() {
  return Boolean(process.env.VERCEL);
}
