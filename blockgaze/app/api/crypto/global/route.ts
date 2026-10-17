import { fail, ok } from "@/lib/api";
import { getGlobal } from "@/lib/coingecko";

export async function GET() {
  try {
    return ok(await getGlobal());
  } catch (e) {
    return fail(e);
  }
}
