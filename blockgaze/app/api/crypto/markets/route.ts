import type { NextRequest } from "next/server";
import { fail, ok } from "@/lib/api";
import { getMarkets } from "@/lib/coingecko";
import { isCoinId } from "@/lib/validate";

export async function GET(req: NextRequest) {
  const raw = req.nextUrl.searchParams.get("ids");
  const ids = raw ? raw.split(",").slice(0, 100) : undefined;
  if (ids && !ids.every(isCoinId)) {
    return Response.json({ error: "Invalid coin id." }, { status: 400 });
  }
  try {
    return ok(await getMarkets({ ids }));
  } catch (e) {
    return fail(e);
  }
}
