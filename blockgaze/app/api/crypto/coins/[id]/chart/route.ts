import type { NextRequest } from "next/server";
import { fail, ok } from "@/lib/api";
import { getChart } from "@/lib/coingecko";
import { isPeriod } from "@/lib/types";

export async function GET(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const days = req.nextUrl.searchParams.get("days") ?? "7";
  if (!isPeriod(days)) {
    return Response.json({ error: "days must be 1, 7, 30 or 365." }, { status: 400 });
  }
  try {
    return ok(await getChart(id, days));
  } catch (e) {
    return fail(e);
  }
}
