import { BINANCE_ASSETS } from "@/lib/binance-markets";

export const CHART_PAIRS = BINANCE_ASSETS.map((asset) => ({
  symbol: asset.symbol,
  pair: asset.pair,
}));

export type ChartSeries = {
  symbol: string;
  closes: number[];
};

export type Candle = {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
};

const BINANCE_KLINE_HOSTS = [
  "https://data-api.binance.vision",
  "https://api.binance.com",
] as const;

async function fetchKlines(pair: string, interval: string, limit: number): Promise<unknown[] | null> {
  for (const host of BINANCE_KLINE_HOSTS) {
    try {
      const url = new URL("/api/v3/klines", host);
      url.searchParams.set("symbol", pair);
      url.searchParams.set("interval", interval);
      url.searchParams.set("limit", String(limit));

      const response = await fetch(url.toString(), {
        cache: "no-store",
        credentials: "omit",
        headers: { Accept: "application/json" },
      });
      if (!response.ok) continue;

      const payload = (await response.json()) as unknown;
      if (!Array.isArray(payload) || payload.length === 0) continue;
      return payload;
    } catch {
      // Try the next Binance market-data host.
    }
  }
  return null;
}

async function fetchPairCloses(pair: string): Promise<number[]> {
  const payload = await fetchKlines(pair, "1h", 24);
  if (!payload) return [];

  const closes = payload.flatMap((row) => {
    if (!Array.isArray(row) || row.length < 5) return [];
    const close = Number(row[4]);
    return Number.isFinite(close) ? [close] : [];
  });
  return closes.length >= 8 ? closes : [];
}

export async function fetchPairCandles(symbol: string): Promise<Candle[]> {
  const pair = CHART_PAIRS.find((item) => item.symbol === symbol)?.pair;
  if (!pair) return [];

  const payload = await fetchKlines(pair, "15m", 96);
  if (!payload) return [];

  return payload.flatMap((row) => {
    if (!Array.isArray(row) || row.length < 5) return [];
    const time = Number(row[0]);
    const open = Number(row[1]);
    const high = Number(row[2]);
    const low = Number(row[3]);
    const close = Number(row[4]);
    if (![time, open, high, low, close].every(Number.isFinite)) return [];
    return [{ time: Math.floor(time / 1000), open, high, low, close }];
  });
}

export async function fetchMarketCharts(): Promise<ChartSeries[]> {
  const rows = await Promise.all(
    CHART_PAIRS.map(async (item) => ({
      symbol: item.symbol,
      closes: await fetchPairCloses(item.pair),
    })),
  );
  return rows.filter((row) => row.closes.length > 0);
}

export function seriesMap(rows: ChartSeries[]): Record<string, number[]> {
  return Object.fromEntries(rows.map((row) => [row.symbol, row.closes]));
}
