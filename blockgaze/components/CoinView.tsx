"use client";

import Link from "next/link";
import { useWatchlist } from "@/hooks/useWatchlist";
import { useCoin } from "@/lib/client";
import {
  formatCompactUsd,
  formatDate,
  formatFullUsd,
  formatPct,
  formatPrice,
  formatSupply,
} from "@/lib/format";
import type { CoinDetail } from "@/lib/types";
import { Change } from "./Change";
import { CoinIcon } from "./CoinIcon";
import { PriceChart } from "./PriceChart";
import { ErrorState, Skeleton } from "./States";
import { UpdatedAt } from "./UpdatedAt";
import { WatchTextButton } from "./WatchButton";

function Stat({ label, children, title }: { label: string; children: React.ReactNode; title?: string }) {
  return (
    <div className="border-t border-line py-3">
      <dt className="text-sm text-muted">{label}</dt>
      <dd className="mt-1 font-medium tabular-nums" title={title}>
        {children}
      </dd>
    </div>
  );
}

export function CoinView({ id, initial }: { id: string; initial?: CoinDetail }) {
  const q = useCoin(id, initial);
  const watchlist = useWatchlist();
  const coin = q.data;

  if (q.isPending) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-12 w-64" />
        <Skeleton className="h-72 w-full" />
      </div>
    );
  }
  if (!coin) {
    return <ErrorState message={q.error?.message ?? "Coin data could not be loaded."} onRetry={() => q.refetch()} />;
  }

  return (
    <div className="space-y-10">
      <nav aria-label="Breadcrumb" className="text-sm text-muted">
        <Link href="/" className="inline-flex min-h-11 items-center underline underline-offset-2">
          Market
        </Link>
        <span aria-hidden="true"> / </span>
        <span aria-current="page">{coin.name}</span>
      </nav>

      <header className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <CoinIcon src={coin.image} name={coin.name} size={40} />
            <h1>
              {coin.name} <span className="text-lg font-normal text-muted sm:text-xl">{coin.symbol.toUpperCase()}</span>
            </h1>
          </div>
          <p className="mt-4 text-4xl font-semibold tabular-nums sm:text-5xl">{formatPrice(coin.price)}</p>
          <p className="mt-2 text-sm text-muted">
            <Change value={coin.change24h} className="font-medium" /> in 24h
            {coin.rank ? <> &middot; Rank {coin.rank} by market cap</> : null}
          </p>
          <p className="mt-1 text-sm text-muted">
            <UpdatedAt timestamp={q.dataUpdatedAt} />
          </p>
        </div>
        <WatchTextButton
          name={coin.name}
          watched={watchlist.has(coin.id)}
          onToggle={() => watchlist.toggle(coin.id)}
        />
      </header>

      <PriceChart coinId={coin.id} coinName={coin.name} />

      <section aria-labelledby="stats-heading">
        <h2 id="stats-heading">Market data</h2>
        <dl className="mt-4 grid gap-x-8 sm:grid-cols-2 lg:grid-cols-3">
          <Stat label="Market cap" title={formatFullUsd(coin.marketCap)}>{formatCompactUsd(coin.marketCap)}</Stat>
          <Stat label="24h trading volume" title={formatFullUsd(coin.volume)}>{formatCompactUsd(coin.volume)}</Stat>
          <Stat label="Fully diluted valuation" title={formatFullUsd(coin.fdv)}>{formatCompactUsd(coin.fdv)}</Stat>
          <Stat label="24h low">{formatPrice(coin.low24h)}</Stat>
          <Stat label="24h high">{formatPrice(coin.high24h)}</Stat>
          <Stat label="Circulating supply">{formatSupply(coin.circulating, coin.symbol)}</Stat>
          <Stat label="Total supply">{formatSupply(coin.totalSupply, coin.symbol)}</Stat>
          <Stat label="Max supply">{coin.maxSupply == null ? "No fixed maximum listed" : formatSupply(coin.maxSupply, coin.symbol)}</Stat>
          <Stat label="All-time high">
            {formatPrice(coin.ath)}
            <span className="block text-sm font-normal text-muted">
              {formatDate(coin.athDate)}, now {formatPct(coin.athChangePct)} from it
            </span>
          </Stat>
          <Stat label="All-time low">
            {formatPrice(coin.atl)}
            <span className="block text-sm font-normal text-muted">
              {formatDate(coin.atlDate)}, now {formatPct(coin.atlChangePct)} from it
            </span>
          </Stat>
        </dl>
      </section>

      {(coin.description || coin.homepage || coin.categories.length > 0) && (
        <section aria-labelledby="about-heading" className="max-w-prose">
          <h2 id="about-heading">About {coin.name}</h2>
          {coin.description && <p className="mt-3 leading-7">{coin.description}</p>}
          {coin.categories.length > 0 && (
            <p className="mt-3 text-sm text-muted">Categories: {coin.categories.join(", ")}</p>
          )}
          {coin.homepage && (
            <p className="mt-3">
              <a
                href={coin.homepage}
                target="_blank"
                rel="noopener noreferrer nofollow"
                className="inline-flex min-h-11 items-center text-accent underline underline-offset-2"
              >
                Official website (opens in a new tab)
              </a>
            </p>
          )}
        </section>
      )}
    </div>
  );
}
