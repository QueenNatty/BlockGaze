import type { Metadata } from "next";
import { WatchlistView } from "@/components/WatchlistView";

export const metadata: Metadata = {
  title: "Watchlist",
  description: "Coins you saved in this browser.",
  robots: { index: false, follow: true },
};

export default function WatchlistPage() {
  return (
    <>
      <div className="mb-6 max-w-2xl">
        <h1>Watchlist</h1>
        <p className="mt-2 text-muted">Coins you have starred. The list lives in this browser only.</p>
      </div>
      <WatchlistView />
    </>
  );
}
