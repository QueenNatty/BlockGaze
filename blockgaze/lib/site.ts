function resolveSiteUrl(): string {
  const raw = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (raw) {
    try {
      return new URL(raw).origin;
    } catch {
      /* invalid value: fall through to the defaults below */
    }
  }
  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  if (vercel) return `https://${vercel}`;
  return "http://localhost:3000";
}

export const SITE_NAME = "BlockGaze";
export const SITE_URL = resolveSiteUrl();
export const SITE_DESCRIPTION =
  "Prices, market caps and trading volume for the top 100 cryptocurrencies, with price charts and a watchlist saved in your browser. Data from CoinGecko.";
export const CONTACT_EMAIL =
  process.env.NEXT_PUBLIC_CONTACT_EMAIL?.trim() || "";
export const LEGAL_UPDATED = "October 5, 2026";
