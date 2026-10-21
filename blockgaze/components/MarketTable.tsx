"use client";

import Link from "next/link";
import { cn } from "@/lib/cn";
import { formatCompactUsd, formatPrice } from "@/lib/format";
import type { Market } from "@/lib/types";
import { Change } from "./Change";
import { CoinIcon } from "./CoinIcon";
import { Sparkline } from "./Sparkline";
import { WatchIconButton } from "./WatchButton";

export type SortKey =
  | "rank"
  | "name"
  | "price"
  | "change24h"
  | "change7d"
  | "marketCap"
  | "volume";
export type SortState = { key: SortKey; dir: "asc" | "desc" };

type Column = {
  key: SortKey;
  label: string;
  align: "left" | "right";
  /** Tailwind classes that control when the column is visible */
  show: string;
};

const COLUMNS: Column[] = [
  { key: "rank", label: "#", align: "left", show: "hidden sm:table-cell" },
  { key: "name", label: "Coin", align: "left", show: "" },
  { key: "price", label: "Price", align: "right", show: "" },
  {
    key: "change24h",
    label: "24h",
    align: "right",
    show: "hidden sm:table-cell",
  },
  {
    key: "change7d",
    label: "7d",
    align: "right",
    show: "hidden md:table-cell",
  },
  {
    key: "marketCap",
    label: "Market cap",
    align: "right",
    show: "hidden md:table-cell",
  },
  {
    key: "volume",
    label: "24h volume",
    align: "right",
    show: "hidden lg:table-cell",
  },
];

export function MarketTable({
  rows,
  caption,
  sort,
  onSort,
  isWatched,
  onToggleWatch,
}: {
  rows: Market[];
  caption: string;
  sort?: SortState;
  onSort?: (key: SortKey) => void;
  isWatched: (id: string) => boolean;
  onToggleWatch: (id: string) => void;
}) {
  return (
    <div className="overflow-x-auto border-y border-line">
      <table className="w-full border-collapse text-sm sm:text-base">
        <caption className="sr-only">{caption}</caption>
        <thead>
          <tr className="border-b border-line text-left text-sm text-muted">
            <th scope="col" className="w-11 py-2 pr-1">
              <span className="sr-only">Watchlist</span>
            </th>
            {COLUMNS.map((c) => {
              const active = sort?.key === c.key;
              const ariaSort = active
                ? sort.dir === "asc"
                  ? "ascending"
                  : "descending"
                : undefined;
              return (
                <th
                  key={c.key}
                  scope="col"
                  aria-sort={onSort ? ariaSort : undefined}
                  className={cn(
                    "py-2 font-medium",
                    c.align === "right" ? "pl-3 text-right" : "pr-3",
                    c.show,
                  )}
                >
                  {onSort ? (
                    <button
                      type="button"
                      onClick={() => onSort(c.key)}
                      className={cn(
                        "inline-flex min-h-11 items-center gap-1 font-medium hover:text-ink",
                        active && "text-ink",
                      )}
                    >
                      {c.label}
                      <span aria-hidden="true" className="w-3 text-xs">
                        {active
                          ? sort.dir === "asc"
                            ? "\u25B2"
                            : "\u25BC"
                          : ""}
                      </span>
                    </button>
                  ) : (
                    c.label
                  )}
                </th>
              );
            })}
            <th
              scope="col"
              className="hidden pl-3 text-right font-medium lg:table-cell"
            >
              7d trend
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((m) => {
            const watched = isWatched(m.id);
            return (
              <tr
                key={m.id}
                className="border-b border-line last:border-b-0 hover:bg-ink/[0.03]"
              >
                <td className="w-11 py-1 pr-1">
                  <WatchIconButton
                    name={m.name}
                    watched={watched}
                    onToggle={() => onToggleWatch(m.id)}
                  />
                </td>
                <td className="hidden py-3 pr-3 tabular-nums text-muted sm:table-cell">
                  {m.rank ?? "n/a"}
                </td>
                <td className="w-full max-w-0 py-3 pr-3">
                  <Link
                    href={`/coin/${m.id}`}
                    className="flex min-h-11 items-center gap-3"
                  >
                    <CoinIcon src={m.image} name={m.name} />
                    <span className="min-w-0">
                      <span className="block truncate font-medium">
                        {m.name}
                      </span>
                      <span className="block text-sm text-muted">
                        {m.symbol.toUpperCase()}
                      </span>
                    </span>
                  </Link>
                </td>
                <td className="py-3 pl-3 text-right tabular-nums">
                  {formatPrice(m.price)}
                  <Change
                    value={m.change24h}
                    className="block text-sm sm:hidden"
                  />
                </td>
                <td className="hidden py-3 pl-3 text-right sm:table-cell">
                  <Change value={m.change24h} />
                </td>
                <td className="hidden py-3 pl-3 text-right lg:table-cell">
                  <Change value={m.change7d} />
                </td>
                <td className="hidden py-3 pl-3 text-right tabular-nums md:table-cell">
                  {formatCompactUsd(m.marketCap)}
                </td>
                <td className="hidden py-3 pl-3 text-right tabular-nums lg:table-cell">
                  {formatCompactUsd(m.volume)}
                </td>
                <td className="hidden py-3 pl-3 lg:table-cell">
                  <div className="flex justify-end">
                    <Sparkline
                      points={m.spark}
                      positive={(m.change7d ?? 0) >= 0}
                    />
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
