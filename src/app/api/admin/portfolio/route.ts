import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { getPortfolio, savePortfolio } from "@/lib/portfolio";
import type { PortfolioData } from "@/content/defaultPortfolio";

export async function GET() {
  const data = await getPortfolio();
  return NextResponse.json(data);
}

export async function PUT(req: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = (await req.json()) as PortfolioData;
  await savePortfolio(body);
  return NextResponse.json({ ok: true });
}
