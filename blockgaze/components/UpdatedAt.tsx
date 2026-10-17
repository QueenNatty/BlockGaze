"use client";

import { useIsClient } from "@/hooks/useWatchlist";

/** Rendered only after hydration so server and browser time zones cannot mismatch. */
export function UpdatedAt({ timestamp }: { timestamp: number }) {
  const isClient = useIsClient();
  if (!isClient || !timestamp) return null;
  return (
    <span>
      Updated{" "}
      {new Date(timestamp).toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit", second: "2-digit" })}
    </span>
  );
}
