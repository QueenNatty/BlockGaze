# BlockGaze

Cryptocurrency prices, charts and a browser based watchlist. Next.js (App Router), TypeScript, Tailwind CSS,
TanStack Query, Recharts, CoinGecko API.

## Run

```bash
cp .env.example .env.local   # optional: add a CoinGecko demo key
npm install
npm run dev
```

Checks: `npm run typecheck`, `npm run lint`, `npm run build`.

## Structure

- `app/api/crypto/*` Route Handlers that proxy CoinGecko. The API key stays on the server.
- `lib/coingecko.ts` server-only client, response normalisation, input validation.
- `app/page.tsx`, `app/coin/[id]/page.tsx` server components that fetch initial data for first paint and SEO.
- `components/` client components (table, search, sort, chart, watchlist).
- `hooks/useWatchlist.ts` watchlist in localStorage via `useSyncExternalStore`.

## Environment variables

See `.env.example`. Only `COINGECKO_API_KEY` is secret and it is never prefixed with `NEXT_PUBLIC_`.
