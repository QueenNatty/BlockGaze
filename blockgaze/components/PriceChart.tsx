"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { cn } from "@/lib/cn";
import { useChart } from "@/lib/client";
import { formatPrice } from "@/lib/format";
import { PERIODS, type Period } from "@/lib/types";
import { Change } from "./Change";
import { ErrorState, Skeleton } from "./States";

// Recharts is the heaviest dependency, so it loads only when a chart is shown.
const ChartCanvas = dynamic(() => import("./ChartCanvas"), {
  ssr: false,
  loading: () => <Skeleton className="h-72 w-full sm:h-96" />,
});

export function PriceChart({ coinId, coinName }: { coinId: string; coinName: string }) {
  const [period, setPeriod] = useState<Period>("7");
  const chart = useChart(coinId, period);
  const long = PERIODS.find((p) => p.value === period)?.long ?? "";

  const data = chart.data;
  const first = data?.[0]?.[1];
  const last = data?.[data.length - 1]?.[1];
  const change = first && last ? ((last - first) / first) * 100 : null;
  const prices = data?.map((d) => d[1]) ?? [];
  const low = prices.length ? Math.min(...prices) : null;
  const high = prices.length ? Math.max(...prices) : null;

  return (
    <section aria-labelledby="chart-heading" className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 id="chart-heading">Price chart</h2>
        <div role="group" aria-label="Chart period" className="flex gap-1">
          {PERIODS.map((p) => (
            <button
              key={p.value}
              type="button"
              aria-pressed={period === p.value}
              onClick={() => setPeriod(p.value)}
              className={cn(
                "min-h-11 min-w-12 rounded-md border px-3 text-sm font-medium",
                period === p.value
                  ? "border-accent bg-accent text-on-accent"
                  : "border-muted/60 text-ink hover:bg-ink/5",
              )}
            >
              <span aria-hidden="true">{p.label}</span>
              <span className="sr-only">{p.long}</span>
            </button>
          ))}
        </div>
      </div>

      {chart.isPending ? (
        <Skeleton className="h-72 w-full sm:h-96" />
      ) : chart.isError && !data ? (
        <ErrorState title="Could not load the chart" message={chart.error.message} onRetry={() => chart.refetch()} />
      ) : data && data.length > 1 ? (
        <>
          <div role="img" aria-label={`${coinName} price over the last ${long}, from ${formatPrice(low)} to ${formatPrice(high)}`}>
            <ChartCanvas data={data} period={period} positive={(change ?? 0) >= 0} />
          </div>
          <p className="text-sm text-muted" aria-live="polite">
            Last {long}: <Change value={change} />, low {formatPrice(low)}, high {formatPrice(high)}
          </p>
        </>
      ) : (
        <p className="border border-line bg-surface p-6 text-muted">No price history is available for this period.</p>
      )}
    </section>
  );
}
