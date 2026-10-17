"use client";

import { useCallback, useSyncExternalStore } from "react";
import { isCoinId } from "@/lib/validate";

const KEY = "blockgaze:watchlist:v1";
const EVENT = "blockgaze:watchlist";
const MAX = 100;
const EMPTY: string[] = [];

let cachedRaw: string | null = null;
let cached: string[] = EMPTY;

function read(): string[] {
  try {
    const raw = window.localStorage.getItem(KEY);
    if (raw === cachedRaw) return cached;
    cachedRaw = raw;
    const parsed: unknown = raw ? JSON.parse(raw) : [];
    cached = Array.isArray(parsed)
      ? parsed.filter((x): x is string => typeof x === "string" && isCoinId(x)).slice(0, MAX)
      : EMPTY;
    return cached;
  } catch {
    return EMPTY;
  }
}

function write(ids: string[]) {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(ids));
  } catch {
    /* storage unavailable (private mode or full): the change lasts for this visit only */
  }
  window.dispatchEvent(new Event(EVENT));
}

function subscribe(cb: () => void) {
  window.addEventListener("storage", cb);
  window.addEventListener(EVENT, cb);
  return () => {
    window.removeEventListener("storage", cb);
    window.removeEventListener(EVENT, cb);
  };
}

export function useWatchlist() {
  const ids = useSyncExternalStore(subscribe, read, () => EMPTY);

  const toggle = useCallback((id: string) => {
    const current = read();
    write(current.includes(id) ? current.filter((x) => x !== id) : [...current, id].slice(-MAX));
  }, []);

  return { ids, toggle, has: (id: string) => ids.includes(id) };
}

const noopSubscribe = () => () => {};
/** False during server render and hydration, true afterwards. */
export function useIsClient() {
  return useSyncExternalStore(noopSubscribe, () => true, () => false);
}
