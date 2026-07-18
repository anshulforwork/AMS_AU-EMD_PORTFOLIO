import { promises as fs } from "fs";
import path from "path";
import { defaultPortfolio, type PortfolioData } from "@/content/defaultPortfolio";
import {
  getKvClient,
  getStorageSetupHint,
  hasPersistentStore,
  isVercelRuntime,
} from "@/lib/kv-store";

const DATA_PATH = path.join(process.cwd(), "data", "portfolio.json");
const KV_KEY = "ams:portfolio";

function normalizePortfolio(data: PortfolioData): PortfolioData {
  return {
    ...data,
    achievements: data.achievements ?? [],
    certifications: data.certifications ?? [],
    offerLetters: data.offerLetters ?? defaultPortfolio.offerLetters ?? [],
    gallery: data.gallery ?? [],
  };
}

async function readLocalSeed(): Promise<PortfolioData> {
  try {
    const raw = await fs.readFile(DATA_PATH, "utf8");
    return normalizePortfolio(JSON.parse(raw) as PortfolioData);
  } catch {
    return defaultPortfolio;
  }
}

export async function getPortfolio(): Promise<PortfolioData> {
  const kv = getKvClient();
  if (kv) {
    const stored = (await kv.get(KV_KEY)) as PortfolioData | null;
    if (stored) return normalizePortfolio(stored);
    const seed = await readLocalSeed();
    await kv.set(KV_KEY, seed);
    return seed;
  }
  return readLocalSeed();
}

export async function savePortfolio(data: PortfolioData): Promise<void> {
  const kv = getKvClient();
  if (kv) {
    await kv.set(KV_KEY, data);
    return;
  }

  // On Vercel, filesystem is read-only — refuse with a clear error.
  if (isVercelRuntime() || !hasPersistentStore()) {
    if (isVercelRuntime()) {
      throw new Error(getStorageSetupHint());
    }
  }

  const dir = path.dirname(DATA_PATH);
  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(DATA_PATH, JSON.stringify(data, null, 2), "utf8");
}

export function getProjectFromPortfolio(data: PortfolioData, slug: string) {
  return data.projects.find((p) => p.slug === slug);
}
