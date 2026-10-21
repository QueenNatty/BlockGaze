"use client";

import { useMemo, useState } from "react";
import { useWatchlist } from "@/hooks/useWatchlist";
import { useMarkets } from "@/lib/client";
import type { GlobalStats, Market } from "@/lib/types";
import { GlobalStrip } from "./GlobalStrip";
import { MarketTable, type SortKey, type SortState } from "./MarketTable";
import { EmptyState, ErrorState, TableSkeleton } from "./States";
import { UpdatedAt } from "./UpdatedAt";

function compare(a: Market, b: Market, key: SortKey, dir: 1 | -1): number {
  if (key === "name") return a.name.localeCompare(b.name) * dir;
  const av = a[key];
  const bv = b[key];
  // Missing values always sort last, whatever the direction.
  if (av == null && bv == null) return 0;
  if (av == null) return 1;
  if (bv == null) return -1;
  return (av - bv) * dir;
}

export function MarketBoard({ initialMarkets, initialGlobal }: { initialMarkets?: Market[]; initialGlobal?: GlobalStats }) {
  const markets = useMarkets(initialMarkets);
  const watchlist = useWatchlist();
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<SortState>({ key: "rank", dir: "asc" });

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    const filtered = (markets.data ?? []).filter(
      (m) => !q || m.name.toLowerCase().includes(q) || m.symbol.toLowerCase().includes(q) || m.id.includes(q),
    );
    const dir = sort.dir === "asc" ? 1 : -1;
    return [...filtered].sort((x, y) => compare(x, y, sort.key, dir));
  }, [markets.data, query, sort]);

  function onSort(key: SortKey) {
    setSort((s) =>
      s.key === key
        ? { key, dir: s.dir === "asc" ? "desc" : "asc" }
        : { key, dir: key === "name" || key === "rank" ? "asc" : "desc" },
    );
  }

  return (
    <div className="space-y-6">
      <GlobalStrip initial={initialGlobal} />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="w-full sm:max-w-sm">
          <label htmlFor="coin-search" className="mb-1 block text-sm font-medium">
            Search coins
          </label>
          <input
            id="coin-search"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Name or symbol, such as ethereum or sol"
            autoComplete="off"
            autoCapitalize="none"
            spellCheck={false}
            className="field"
          />
        </div>
        <div className="w-full md:hidden">
          <label htmlFor="sort" className="mb-1 block text-sm font-medium">Sort by</label>
          <select
            id="sort"
            className="field"
            value={`${sort.key}:${sort.dir}`}
            onChange={(e) => {
              const [key, dir] = e.target.value.split(":") as [SortKey, "asc" | "desc"];
              setSort({ key, dir });
            }}
          >
            <option value="rank:asc">Market cap rank</option>
            <option value="change24h:desc">Biggest 24h gain</option>
            <option value="change24h:asc">Biggest 24h loss</option>
            <option value="price:desc">Price, high to low</option>
            <option value="volume:desc">24h volume</option>
            <option value="name:asc">Name A to Z</option>
          </select>
        </div>
        <p className="flex flex-col text-sm text-muted sm:items-end" aria-live="polite">
          {markets.data && (
            <span>
              {rows.length === markets.data.length
                ? `Top ${markets.data.length} coins by market cap`
                : `${rows.length} of ${markets.data.length} coins match`}
            </span>
          )}
          <UpdatedAt timestamp={markets.dataUpdatedAt} />
        </p>
      </div>

      {markets.isError && markets.data && (
        <p role="status" className="border border-loss/50 bg-surface px-4 py-3 text-sm">
          The latest refresh failed, so these prices may be out of date. {markets.error.message}
        </p>
      )}

      {markets.isPending ? (
        <TableSkeleton />
      ) : markets.isError && !markets.data ? (
        <ErrorState message={markets.error.message} onRetry={() => markets.refetch()} />
      ) : rows.length === 0 ? (
        <EmptyState title="No coins match your search">
          Only the top 100 coins by market cap are listed here. Check the spelling or try the coin&apos;s symbol.
          <button type="button" onClick={() => setQuery("")} className="btn-quiet mt-4 block">
            Clear search
          </button>
        </EmptyState>
      ) : (
        <MarketTable
          rows={rows}
          caption="Top 100 cryptocurrencies by market cap, priced in US dollars"
          sort={sort}
          onSort={onSort}
          isWatched={watchlist.has}
          onToggleWatch={watchlist.toggle}
        />
      )}
    </div>
  );
}
