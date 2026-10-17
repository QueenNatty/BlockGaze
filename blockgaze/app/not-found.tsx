import Link from "next/link";

export default function NotFound() {
  return (
    <div className="max-w-xl py-8">
      <h1>Page not found</h1>
      <p className="mt-3 text-muted">
        This address does not match a page on BlockGaze. The link may be mistyped, or the coin may not exist.
      </p>
      <div className="mt-6 flex flex-wrap gap-3">
        <Link href="/" className="btn-primary">
          Go to the market
        </Link>
        <Link href="/watchlist" className="btn-quiet">
          Open your watchlist
        </Link>
      </div>
    </div>
  );
}
