import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CoinView } from "@/components/CoinView";
import { CoinGeckoError, getCoin } from "@/lib/coingecko";
import type { CoinDetail } from "@/lib/types";
import { isCoinId } from "@/lib/validate";

export const revalidate = 60;

async function load(id: string): Promise<CoinDetail | undefined> {
  if (!isCoinId(id)) notFound();
  try {
    return await getCoin(id);
  } catch (e) {
    if (e instanceof CoinGeckoError && e.status === 404) notFound();
    // Rate limit or outage: render the page and let the client retry.
    return undefined;
  }
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const coin = await load(id);
  const name = coin ? `${coin.name} (${coin.symbol.toUpperCase()})` : id;
  return {
    title: `${name} price, chart and market data`,
    description: `${name} price in US dollars with market cap, trading volume, supply and price charts for 24 hours, 7 days, 30 days and 1 year.`,
    alternates: { canonical: `/coin/${id}` },
  };
}

export default async function CoinPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const coin = await load(id);
  return <CoinView id={id} initial={coin} />;
}
