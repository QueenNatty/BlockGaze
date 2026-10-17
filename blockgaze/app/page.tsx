import type { Metadata } from "next";
import { MarketBoard } from "@/components/MarketBoard";
import { getGlobal, getMarkets } from "@/lib/coingecko";

export const revalidate = 60;

export const metadata: Metadata = {
  title: { absolute: "BlockGaze: cryptocurrency prices, charts and market data" },
  alternates: { canonical: "/" },
};

export default async function HomePage() {
  // Fetched on the server so the first paint already has data and crawlers can read it.
  // If the provider is down or rate limited, the client component shows an error with a retry.
  const [markets, global] = await Promise.allSettled([getMarkets(), getGlobal()]);

  return (
    <>
      <div className="mb-6 max-w-2xl">
        <h1>Crypto market</h1>
        <p className="mt-2 text-muted">
          The 100 largest coins by market cap, in US dollars. Prices refresh every minute while this tab is open.
        </p>
      </div>
      <MarketBoard
        initialMarkets={markets.status === "fulfilled" ? markets.value : undefined}
        initialGlobal={global.status === "fulfilled" ? global.value : undefined}
      />
    </>
  );
}
