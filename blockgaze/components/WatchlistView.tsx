"use client";

import { useIsClient, useWatchlist } from "@/hooks/useWatchlist";
import { useWatchedMarkets } from "@/lib/client";
import { MarketTable } from "./MarketTable";
import { EmptyState, ErrorState, TableSkeleton } from "./States";
import { UpdatedAt } from "./UpdatedAt";

export function WatchlistView() {
  const isClient = useIsClient();
  const { ids, has, toggle } = useWatchlist();
  const q = useWatchedMarkets(ids);

  if (!isClient) return <TableSkeleton rows={3} />;

  if (ids.length === 0) {
    return (
      <EmptyState title="Your watchlist is empty" actionHref="/" actionLabel="Browse the market">
        Select the star next to a coin to save it here. Saved coins stay in this browser and are not sent to us.
      </EmptyState>
    );
  }

  if (q.isPending) return <TableSkeleton rows={Math.min(ids.length, 8)} />;
  if (q.isError && !q.data) return <ErrorState message={q.error.message} onRetry={() => q.refetch()} />;

  const rows = (q.data ?? []).filter((m) => ids.includes(m.id));
  const missing = ids.length - rows.length;

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted" aria-live="polite">
        {rows.length} saved {rows.length === 1 ? "coin" : "coins"}. <UpdatedAt timestamp={q.dataUpdatedAt} />
      </p>
      {missing > 0 && (
        <p role="status" className="border border-line bg-surface px-4 py-3 text-sm">
          {missing} saved {missing === 1 ? "coin" : "coins"} could not be found. {missing === 1 ? "It" : "They"} may have been delisted.
        </p>
      )}
      {rows.length > 0 && (
        <MarketTable rows={rows} caption="Your watchlist" isWatched={has} onToggleWatch={toggle} />
      )}
    </div>
  );
}
