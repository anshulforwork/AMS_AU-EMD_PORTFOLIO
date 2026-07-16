import { promises as fs } from "fs";
import path from "path";
import { defaultPortfolio, type PortfolioData } from "@/content/defaultPortfolio";

const DATA_PATH = path.join(process.cwd(), "data", "portfolio.json");

export async function getPortfolio(): Promise<PortfolioData> {
  try {
    const raw = await fs.readFile(DATA_PATH, "utf8");
    return JSON.parse(raw) as PortfolioData;
  } catch {
    return defaultPortfolio;
  }
}

export async function savePortfolio(data: PortfolioData): Promise<void> {
  const dir = path.dirname(DATA_PATH);
  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(DATA_PATH, JSON.stringify(data, null, 2), "utf8");
}

export function getProjectFromPortfolio(data: PortfolioData, slug: string) {
  return data.projects.find((p) => p.slug === slug);
}
