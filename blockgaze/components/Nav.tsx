"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useWatchlist } from "@/hooks/useWatchlist";
import { cn } from "@/lib/cn";

export function Nav() {
  const pathname = usePathname();
  const { ids } = useWatchlist();

  const items = [
    { href: "/", label: "Market", active: pathname === "/" || pathname.startsWith("/coin/") },
    { href: "/watchlist", label: ids.length ? `Watchlist (${ids.length})` : "Watchlist", active: pathname === "/watchlist" },
  ];

  return (
    <nav aria-label="Main" className="flex gap-1">
      {items.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          aria-current={item.active ? "page" : undefined}
          className={cn(
            "flex min-h-11 items-center px-3 text-sm font-medium underline-offset-8",
            item.active ? "text-ink underline decoration-2 decoration-accent" : "text-muted hover:text-ink",
          )}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
}
