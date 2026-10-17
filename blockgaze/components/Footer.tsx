import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-line">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-8 text-sm text-muted sm:px-6 md:flex-row md:items-start md:justify-between">
        <div className="max-w-md space-y-2">
          <p>
            Market data from{" "}
            <a
              href="https://www.coingecko.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-ink underline underline-offset-2"
            >
              CoinGecko
            </a>
            . Prices are in US dollars and can be delayed or wrong.
          </p>
          <p>BlockGaze is for information only and is not financial advice.</p>
        </div>
        <nav aria-label="Legal" className="flex gap-1">
          <Link href="/privacy" className="flex min-h-11 items-center px-3 text-ink underline underline-offset-2">
            Privacy policy
          </Link>
          <Link href="/terms" className="flex min-h-11 items-center px-3 text-ink underline underline-offset-2">
            Terms and conditions
          </Link>
        </nav>
      </div>
    </footer>
  );
}
