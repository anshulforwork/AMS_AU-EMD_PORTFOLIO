import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { getPortfolio, savePortfolio } from "@/lib/portfolio";
import type { PortfolioData } from "@/content/defaultPortfolio";
import { getStorageSetupHint, hasPersistentStore, isVercelRuntime } from "@/lib/kv-store";

export const dynamic = "force-dynamic";

export async function GET() {
  const data = await getPortfolio();
  return NextResponse.json(data);
}

export async function PUT(req: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (isVercelRuntime() && !hasPersistentStore()) {
    return NextResponse.json(
      {
        error: "Storage not configured",
        message: getStorageSetupHint(),
      },
      { status: 503 },
    );
  }

  try {
    const body = (await req.json()) as PortfolioData;
    await savePortfolio(body);
    return NextResponse.json({ ok: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Save failed";
    console.error("[admin/portfolio PUT]", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
