"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import type { ChartPoint, CoinDetail, GlobalStats, Market, Period } from "./types";

export const REFRESH_MS = 60_000;

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
  }
}

async function getJson<T>(url: string): Promise<T> {
  let res: Response;
  try {
    res = await fetch(url);
  } catch {
    throw new ApiError(0, "You appear to be offline. Check your connection and try again.");
  }
  if (!res.ok) {
    let message = "The request failed.";
    try {
      const body = (await res.json()) as { error?: string };
      if (body.error) message = body.error;
    } catch {
      /* keep default message */
    }
    throw new ApiError(res.status, message);
  }
  return (await res.json()) as T;
}

export function useMarkets(initialData?: Market[]) {
  return useQuery({
    queryKey: ["markets"],
    queryFn: () => getJson<Market[]>("/api/crypto/markets"),
    initialData,
    refetchInterval: REFRESH_MS,
  });
}

export function useWatchedMarkets(ids: string[]) {
  const key = [...ids].sort().join(",");
  return useQuery({
    queryKey: ["markets", "ids", key],
    queryFn: () => getJson<Market[]>(`/api/crypto/markets?ids=${encodeURIComponent(key)}`),
    enabled: ids.length > 0,
    placeholderData: keepPreviousData,
    refetchInterval: REFRESH_MS,
  });
}

export function useGlobal(initialData?: GlobalStats) {
  return useQuery({
    queryKey: ["global"],
    queryFn: () => getJson<GlobalStats>("/api/crypto/global"),
    initialData,
    refetchInterval: REFRESH_MS,
  });
}

export function useCoin(id: string, initialData?: CoinDetail) {
  return useQuery({
    queryKey: ["coin", id],
    queryFn: () => getJson<CoinDetail>(`/api/crypto/coins/${encodeURIComponent(id)}`),
    initialData,
    refetchInterval: REFRESH_MS,
  });
}

export function useChart(id: string, period: Period) {
  return useQuery({
    queryKey: ["chart", id, period],
    queryFn: () => getJson<ChartPoint[]>(`/api/crypto/coins/${encodeURIComponent(id)}/chart?days=${period}`),
    placeholderData: keepPreviousData,
    staleTime: period === "1" ? 60_000 : 300_000,
  });
}
