import "server-only";
import { NextResponse } from "next/server";
import { CoinGeckoError } from "./coingecko";

export function ok(data: unknown) {
  return NextResponse.json(data, {
    headers: { "Cache-Control": "public, s-maxage=30, stale-while-revalidate=60" },
  });
}

export function fail(error: unknown) {
  if (error instanceof CoinGeckoError) {
    if (error.status === 404) {
      return NextResponse.json({ error: "Coin not found." }, { status: 404 });
    }
    if (error.status === 429) {
      return NextResponse.json(
        { error: "The data provider's rate limit was reached. Try again in a minute." },
        { status: 429 },
      );
    }
    return NextResponse.json({ error: "Market data is unavailable right now." }, { status: 502 });
  }
  return NextResponse.json({ error: "Something went wrong on our side." }, { status: 500 });
}
