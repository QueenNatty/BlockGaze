import "server-only";
import type { ChartPoint, CoinDetail, GlobalStats, Market, Period } from "./types";
import { isCoinId } from "./validate";

const PLAN = process.env.COINGECKO_API_PLAN === "pro" ? "pro" : "demo";
const BASE =
  PLAN === "pro"
    ? "https://pro-api.coingecko.com/api/v3"
    : "https://api.coingecko.com/api/v3";

const IMAGE_HOSTS = new Set(["coin-images.coingecko.com", "assets.coingecko.com"]);

export class CoinGeckoError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
    this.name = "CoinGeckoError";
  }
}

async function cg<T>(path: string, params: Record<string, string>, revalidate: number): Promise<T> {
  const url = new URL(BASE + path);
  for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v);

  const headers = new Headers({ accept: "application/json" });
  const key = process.env.COINGECKO_API_KEY;
  if (key) headers.set(PLAN === "pro" ? "x-cg-pro-api-key" : "x-cg-demo-api-key", key);

  let res: Response;
  try {
    res = await fetch(url, { headers, next: { revalidate }, signal: AbortSignal.timeout(8000) });
  } catch {
    throw new CoinGeckoError(504, "CoinGecko did not respond in time");
  }
  if (!res.ok) throw new CoinGeckoError(res.status, `CoinGecko returned ${res.status}`);
  return (await res.json()) as T;
}

const num = (v: unknown): number | null => (typeof v === "number" && Number.isFinite(v) ? v : null);

function safeImage(src: unknown): string {
  if (typeof src !== "string") return "";
  try {
    const u = new URL(src);
    return u.protocol === "https:" && IMAGE_HOSTS.has(u.hostname) ? src : "";
  } catch {
    return "";
  }
}

function downsample<T>(items: T[], max: number): T[] {
  if (items.length <= max) return items;
  const step = Math.ceil(items.length / max);
  const out = items.filter((_, i) => i % step === 0);
  const last = items[items.length - 1] as T;
  if (out[out.length - 1] !== last) out.push(last);
  return out;
}

function plainText(html: string): string {
  return html
    .replace(/<[^>]*>/g, " ")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ")
    .trim();
}

function trimDescription(text: string, max = 900): string {
  if (text.length <= max) return text;
  const cut = text.slice(0, max);
  const end = cut.lastIndexOf(". ");
  return end > 300 ? cut.slice(0, end + 1) : cut.trimEnd() + "...";
}

/* ---------- Markets ---------- */

type RawMarket = {
  id: string;
  symbol: string;
  name: string;
  image?: string;
  current_price?: number | null;
  market_cap?: number | null;
  market_cap_rank?: number | null;
  total_volume?: number | null;
  price_change_percentage_24h?: number | null;
  price_change_percentage_7d_in_currency?: number | null;
  sparkline_in_7d?: { price?: number[] };
};

export async function getMarkets(opts: { ids?: string[]; page?: number; perPage?: number } = {}): Promise<Market[]> {
  const params: Record<string, string> = {
    vs_currency: "usd",
    order: "market_cap_desc",
    per_page: String(Math.min(opts.perPage ?? 100, 100)),
    page: String(opts.page ?? 1),
    sparkline: "true",
    price_change_percentage: "24h,7d",
  };
  if (opts.ids?.length) params.ids = opts.ids.filter(isCoinId).join(",");

  const raw = await cg<RawMarket[]>("/coins/markets", params, 30);
  return raw.map((r) => ({
    id: r.id,
    symbol: r.symbol,
    name: r.name,
    image: safeImage(r.image),
    price: num(r.current_price),
    marketCap: num(r.market_cap),
    rank: num(r.market_cap_rank),
    volume: num(r.total_volume),
    change24h: num(r.price_change_percentage_24h),
    change7d: num(r.price_change_percentage_7d_in_currency),
    spark: downsample(r.sparkline_in_7d?.price ?? [], 42),
  }));
}

/* ---------- Global ---------- */

type RawGlobal = {
  data: {
    total_market_cap: { usd: number };
    total_volume: { usd: number };
    market_cap_percentage: { btc: number };
    market_cap_change_percentage_24h_usd: number;
  };
};

export async function getGlobal(): Promise<GlobalStats> {
  const { data } = await cg<RawGlobal>("/global", {}, 60);
  return {
    marketCap: data.total_market_cap.usd,
    volume: data.total_volume.usd,
    btcDominance: data.market_cap_percentage.btc,
    marketCapChange24h: data.market_cap_change_percentage_24h_usd,
  };
}

/* ---------- Coin detail ---------- */

type RawCoin = {
  id: string;
  symbol: string;
  name: string;
  image?: { large?: string };
  market_cap_rank?: number | null;
  description?: { en?: string };
  categories?: (string | null)[];
  links?: { homepage?: string[] };
  market_data?: {
    current_price?: { usd?: number };
    price_change_percentage_24h?: number;
    high_24h?: { usd?: number };
    low_24h?: { usd?: number };
    market_cap?: { usd?: number };
    total_volume?: { usd?: number };
    fully_diluted_valuation?: { usd?: number };
    circulating_supply?: number;
    total_supply?: number | null;
    max_supply?: number | null;
    ath?: { usd?: number };
    ath_change_percentage?: { usd?: number };
    ath_date?: { usd?: string };
    atl?: { usd?: number };
    atl_change_percentage?: { usd?: number };
    atl_date?: { usd?: string };
  };
};

export async function getCoin(id: string): Promise<CoinDetail> {
  if (!isCoinId(id)) throw new CoinGeckoError(404, "Invalid coin id");
  const r = await cg<RawCoin>(
    `/coins/${encodeURIComponent(id)}`,
    {
      localization: "false",
      tickers: "false",
      community_data: "false",
      developer_data: "false",
      sparkline: "false",
    },
    60,
  );
  const m = r.market_data ?? {};
  const site = r.links?.homepage?.find((h) => /^https?:\/\//i.test(h)) ?? null;
  return {
    id: r.id,
    symbol: r.symbol,
    name: r.name,
    image: safeImage(r.image?.large),
    rank: num(r.market_cap_rank),
    price: num(m.current_price?.usd),
    change24h: num(m.price_change_percentage_24h),
    high24h: num(m.high_24h?.usd),
    low24h: num(m.low_24h?.usd),
    marketCap: num(m.market_cap?.usd),
    volume: num(m.total_volume?.usd),
    fdv: num(m.fully_diluted_valuation?.usd),
    circulating: num(m.circulating_supply),
    totalSupply: num(m.total_supply),
    maxSupply: num(m.max_supply),
    ath: num(m.ath?.usd),
    athChangePct: num(m.ath_change_percentage?.usd),
    athDate: m.ath_date?.usd ?? null,
    atl: num(m.atl?.usd),
    atlChangePct: num(m.atl_change_percentage?.usd),
    atlDate: m.atl_date?.usd ?? null,
    description: trimDescription(plainText(r.description?.en ?? "")),
    homepage: site,
    categories: (r.categories ?? []).filter((c): c is string => typeof c === "string" && c.length > 0).slice(0, 6),
  };
}

/* ---------- Chart ---------- */

export async function getChart(id: string, days: Period): Promise<ChartPoint[]> {
  if (!isCoinId(id)) throw new CoinGeckoError(404, "Invalid coin id");
  const raw = await cg<{ prices?: [number, number][] }>(
    `/coins/${encodeURIComponent(id)}/market_chart`,
    { vs_currency: "usd", days },
    days === "1" ? 60 : 300,
  );
  return downsample(raw.prices ?? [], 200);
}
