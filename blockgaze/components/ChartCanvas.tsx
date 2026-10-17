"use client";

import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { formatAxisPrice, formatPrice } from "@/lib/format";
import type { ChartPoint, Period } from "@/lib/types";

function tickLabel(t: number, period: Period) {
  const d = new Date(t);
  if (period === "1") return d.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" });
  if (period === "365") return d.toLocaleDateString(undefined, { month: "short", year: "2-digit" });
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

function ChartTooltip({
  active,
  payload,
  period,
}: {
  active?: boolean;
  payload?: Array<{ payload: { t: number; p: number } }>;
  period: Period;
}) {
  const point = payload?.[0]?.payload;
  if (!active || !point) return null;
  const when = new Date(point.t).toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    year: period === "365" ? "numeric" : undefined,
    hour: period === "365" ? undefined : "numeric",
    minute: period === "365" ? undefined : "2-digit",
  });
  return (
    <div className="border border-line bg-surface px-3 py-2 text-sm text-ink shadow-sm">
      <div className="font-semibold tabular-nums">{formatPrice(point.p)}</div>
      <div className="text-muted">{when}</div>
    </div>
  );
}

export default function ChartCanvas({
  data,
  period,
  positive,
}: {
  data: ChartPoint[];
  period: Period;
  positive: boolean;
}) {
  const rows = data.map(([t, p]) => ({ t, p }));
  return (
    <div className={positive ? "h-72 text-gain sm:h-96" : "h-72 text-loss sm:h-96"}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={rows} margin={{ top: 8, right: 4, bottom: 0, left: 0 }} accessibilityLayer>
          <CartesianGrid vertical={false} className="stroke-line" />
          <XAxis
            dataKey="t"
            type="number"
            scale="time"
            domain={["dataMin", "dataMax"]}
            tickFormatter={(t: number) => tickLabel(t, period)}
            tick={{ className: "fill-muted text-xs" }}
            tickLine={false}
            axisLine={{ className: "stroke-line" }}
            minTickGap={48}
          />
          <YAxis
            dataKey="p"
            orientation="right"
            domain={["auto", "auto"]}
            width={64}
            tickFormatter={(v: number) => formatAxisPrice(v)}
            tick={{ className: "fill-muted text-xs" }}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip content={<ChartTooltip period={period} />} cursor={{ className: "stroke-muted" }} />
          <Area
            type="monotone"
            dataKey="p"
            stroke="currentColor"
            strokeWidth={2}
            fill="currentColor"
            fillOpacity={0.08}
            dot={false}
            isAnimationActive={false}
            activeDot={{ r: 4, className: "fill-current stroke-surface" }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
