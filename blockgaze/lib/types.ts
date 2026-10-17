export type Market = {
  id: string;
  symbol: string;
  name: string;
  image: string;
  price: number | null;
  marketCap: number | null;
  rank: number | null;
  volume: number | null;
  change24h: number | null;
  change7d: number | null;
  spark: number[];
};

export type GlobalStats = {
  marketCap: number;
  volume: number;
  btcDominance: number;
  marketCapChange24h: number;
};

export type CoinDetail = {
  id: string;
  symbol: string;
  name: string;
  image: string;
  rank: number | null;
  price: number | null;
  change24h: number | null;
  high24h: number | null;
  low24h: number | null;
  marketCap: number | null;
  volume: number | null;
  fdv: number | null;
  circulating: number | null;
  totalSupply: number | null;
  maxSupply: number | null;
  ath: number | null;
  athChangePct: number | null;
  athDate: string | null;
  atl: number | null;
  atlChangePct: number | null;
  atlDate: string | null;
  description: string;
  homepage: string | null;
  categories: string[];
};

/** [timestamp in ms, price in USD] */
export type ChartPoint = [number, number];

export type Period = "1" | "7" | "30" | "365";

export const PERIODS: { value: Period; label: string; long: string }[] = [
  { value: "1", label: "24h", long: "24 hours" },
  { value: "7", label: "7d", long: "7 days" },
  { value: "30", label: "30d", long: "30 days" },
  { value: "365", label: "1y", long: "1 year" },
];

export function isPeriod(value: string): value is Period {
  return PERIODS.some((p) => p.value === value);
}
