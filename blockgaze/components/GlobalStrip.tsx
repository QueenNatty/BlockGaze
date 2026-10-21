"use client";

import { Change } from "./Change";
import { useGlobal } from "@/lib/client";
import { formatCompactUsd } from "@/lib/format";
import type { GlobalStats } from "@/lib/types";

export function GlobalStrip({ initial }: { initial?: GlobalStats }) {
  const { data } = useGlobal(initial);
  // Secondary information: if it fails to load, the market table still works.
  if (!data) return null;

  return (
    <dl className="grid grid-cols-2 gap-4 border-y border-line py-4 sm:grid-cols-3 sm:gap-6">
      <div className="col-span-2 sm:col-span-1">
        <dt className="text-sm text-muted">Total crypto market cap</dt>
        <dd className="mt-1 text-xl font-semibold tabular-nums">
          {formatCompactUsd(data.marketCap)} <Change value={data.marketCapChange24h} className="text-sm font-medium" />
        </dd>
      </div>
      <div>
        <dt className="text-sm text-muted">24h trading volume</dt>
        <dd className="mt-1 text-xl font-semibold tabular-nums">{formatCompactUsd(data.volume)}</dd>
      </div>
      <div>
        <dt className="text-sm text-muted">Bitcoin share of market cap</dt>
        <dd className="mt-1 text-xl font-semibold tabular-nums">{data.btcDominance.toFixed(1)}%</dd>
      </div>
    </dl>
  );
}
