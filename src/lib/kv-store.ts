import { createClient as createKvClient, type VercelKV } from "@vercel/kv";
import { createClient as createRedisClient, type RedisClientType } from "redis";

export type KvLike = {
  get: <T = unknown>(key: string) => Promise<T | null>;
  set: (key: string, value: unknown) => Promise<unknown>;
  del: (key: string) => Promise<unknown>;
};

/**
 * Supports:
 * 1) Upstash/Vercel REST: KV_REST_API_* or UPSTASH_REDIS_REST_*
 * 2) Vercel Redis TCP: REDIS_URL (what you have in .env.local)
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
  return Boolean(getRedisRestConfig() || process.env.REDIS_URL);
}

export function getStorageSetupHint() {
  return (
    "Redis not configured. On Vercel, connect Storage → Redis to this project so REDIS_URL is set, " +
    "or add UPSTASH_REDIS_REST_URL + UPSTASH_REDIS_REST_TOKEN. Then Redeploy."
  );
}

let cached: KvLike | null | undefined;
let redisPromise: Promise<RedisClientType> | null = null;

async function getTcpRedis(): Promise<RedisClientType | null> {
  const url = process.env.REDIS_URL;
  if (!url) return null;

  if (!redisPromise) {
    redisPromise = (async () => {
      const client = createRedisClient({ url });
      client.on("error", (err) => {
        console.error("[redis]", err);
      });
      if (!client.isOpen) {
        await client.connect();
      }
      return client as RedisClientType;
    })().catch((err) => {
      redisPromise = null;
      throw err;
    });
  }

  return redisPromise;
}

function wrapTcpRedis(): KvLike {
  return {
    async get<T = unknown>(key: string) {
      const client = await getTcpRedis();
      if (!client) return null;
      const raw = await client.get(key);
      if (raw == null) return null;
      try {
        return JSON.parse(raw) as T;
      } catch {
        return raw as T;
      }
    },
    async set(key: string, value: unknown) {
      const client = await getTcpRedis();
      if (!client) throw new Error("REDIS_URL client unavailable");
      return client.set(key, JSON.stringify(value));
    },
    async del(key: string) {
      const client = await getTcpRedis();
      if (!client) return 0;
      return client.del(key);
    },
  };
}

function wrapRestKv(client: VercelKV): KvLike {
  return {
    get: (key) => client.get(key),
    set: (key, value) => client.set(key, value),
    del: (key) => client.del(key),
  };
}

export function getKvClient(): KvLike | null {
  if (cached !== undefined) return cached;

  const cfg = getRedisRestConfig();
  if (cfg) {
    try {
      cached = wrapRestKv(
        createKvClient({
          url: cfg.url,
          token: cfg.token,
        }),
      );
      return cached;
    } catch {
      /* fall through to REDIS_URL */
    }
  }

  if (process.env.REDIS_URL) {
    cached = wrapTcpRedis();
    return cached;
  }

  cached = null;
  return null;
}

export function isVercelRuntime() {
  return Boolean(process.env.VERCEL);
}
