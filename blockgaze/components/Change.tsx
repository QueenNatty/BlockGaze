import { cn } from "@/lib/cn";
import { formatPct } from "@/lib/format";

export function Change({ value, className }: { value: number | null | undefined; className?: string }) {
  const tone = value == null || value === 0 ? "text-muted" : value > 0 ? "text-gain" : "text-loss";
  return <span className={cn("tabular-nums", tone, className)}>{formatPct(value)}</span>;
}
