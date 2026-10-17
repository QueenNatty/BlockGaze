export const SITE_NAME = "BlockGaze";
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, "");
export const SITE_DESCRIPTION =
  "Prices, market caps and trading volume for the top 100 cryptocurrencies, with price charts and a watchlist saved in your browser. Data from CoinGecko.";
export const CONTACT_EMAIL = process.env.NEXT_PUBLIC_CONTACT_EMAIL?.trim() || "";
export const LEGAL_UPDATED = "October 5, 2026";
