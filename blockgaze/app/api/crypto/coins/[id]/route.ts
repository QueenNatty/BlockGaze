import { fail, ok } from "@/lib/api";
import { getCoin } from "@/lib/coingecko";

export async function GET(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  try {
    return ok(await getCoin(id));
  } catch (e) {
    return fail(e);
  }
}
