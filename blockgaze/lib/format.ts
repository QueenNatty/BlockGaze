const usd = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });
const usdSmall = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumSignificantDigits: 2,
  maximumSignificantDigits: 4,
});
const usdCompact = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  notation: "compact",
  maximumFractionDigits: 2,
});
const usdAxis = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  notation: "compact",
  maximumFractionDigits: 1,
});
const compact = new Intl.NumberFormat("en-US", { notation: "compact", maximumFractionDigits: 2 });
const dateFmt = new Intl.DateTimeFormat("en-US", { dateStyle: "medium", timeZone: "UTC" });

const NONE = "n/a";

export function formatPrice(v: number | null | undefined): string {
  if (v == null) return NONE;
  if (v === 0) return "$0.00";
  return v >= 1 ? usd.format(v) : usdSmall.format(v);
}

export function formatAxisPrice(v: number): string {
  return v >= 1000 ? usdAxis.format(v) : formatPrice(v);
}

export function formatCompactUsd(v: number | null | undefined): string {
  return v == null ? NONE : usdCompact.format(v);
}

export function formatFullUsd(v: number | null | undefined): string {
  return v == null ? NONE : new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(v);
}

export function formatPct(v: number | null | undefined): string {
  if (v == null) return NONE;
  return `${v >= 0 ? "+" : "\u2212"}${Math.abs(v).toFixed(2)}%`;
}

export function formatSupply(v: number | null | undefined, symbol: string): string {
  return v == null ? NONE : `${compact.format(v)} ${symbol.toUpperCase()}`;
}

export function formatDate(iso: string | null | undefined): string {
  if (!iso) return NONE;
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? NONE : dateFmt.format(d);
}
