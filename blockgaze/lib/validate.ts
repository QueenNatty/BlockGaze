// CoinGecko coin ids are lowercase slugs such as "bitcoin" or "usd-coin".
const COIN_ID = /^[a-z0-9][a-z0-9._-]{0,99}$/;

export function isCoinId(value: string): boolean {
  return COIN_ID.test(value);
}
