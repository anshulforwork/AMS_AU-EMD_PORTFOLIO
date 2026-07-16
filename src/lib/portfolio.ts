import { promises as fs } from "fs";
import path from "path";
import { defaultPortfolio, type PortfolioData } from "@/content/defaultPortfolio";

const DATA_PATH = path.join(process.cwd(), "data", "portfolio.json");
const KV_KEY = "ams:portfolio";

function hasKv() {
  return Boolean(process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN);
}

async function getKvClient() {
  if (!hasKv()) return null;
  try {
    const mod = await import("@vercel/kv");
    return mod.kv;
  } catch {
    return null;
  }
}

async function readLocalSeed(): Promise<PortfolioData> {
  try {
    const raw = await fs.readFile(DATA_PATH, "utf8");
    return JSON.parse(raw) as PortfolioData;
  } catch {
    return defaultPortfolio;
  }
}

export async function getPortfolio(): Promise<PortfolioData> {
  const kv = await getKvClient();
  if (kv) {
    const stored = (await kv.get(KV_KEY)) as PortfolioData | null;
    if (stored) return stored;
    // First run on Vercel: seed KV from repo/local file once.
    const seed = await readLocalSeed();
    await kv.set(KV_KEY, seed);
    return seed;
  }
  return readLocalSeed();
}

export async function savePortfolio(data: PortfolioData): Promise<void> {
  const kv = await getKvClient();
  if (kv) {
    await kv.set(KV_KEY, data);
    return;
  }
  const dir = path.dirname(DATA_PATH);
  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(DATA_PATH, JSON.stringify(data, null, 2), "utf8");
}

export function getProjectFromPortfolio(data: PortfolioData, slug: string) {
  return data.projects.find((p) => p.slug === slug);
}
