export const CHART_PAIRS = [
  { symbol: "BTC", pair: "BTCUSDT" },
  { symbol: "ETH", pair: "ETHUSDT" },
  { symbol: "XRP", pair: "XRPUSDT" },
  { symbol: "SOL", pair: "SOLUSDT" },
  { symbol: "BNB", pair: "BNBUSDT" },
  { symbol: "SPCXB", pair: "SPCXBUSDT" },
  { symbol: "TSLAB", pair: "TSLABUSDT" },
  { symbol: "AAPLB", pair: "AAPLBUSDT" },
  { symbol: "MSTRB", pair: "MSTRBUSDT" },
  { symbol: "NVDAB", pair: "NVDABUSDT" },
] as const;

export type ChartSeries = {
  symbol: string;
  closes: number[];
};

const BINANCE_KLINE_HOSTS = [
  "https://data-api.binance.vision",
  "https://api.binance.com",
] as const;

async function fetchPairCloses(pair: string): Promise<number[]> {
  for (const host of BINANCE_KLINE_HOSTS) {
    try {
      const url = new URL("/api/v3/klines", host);
      url.searchParams.set("symbol", pair);
      url.searchParams.set("interval", "1h");
      url.searchParams.set("limit", "24");

      const response = await fetch(url.toString(), {
        cache: "no-store",
        credentials: "omit",
        headers: { Accept: "application/json" },
      });
      if (!response.ok) continue;

      const payload = (await response.json()) as unknown;
      if (!Array.isArray(payload)) continue;

      const closes = payload.flatMap((row) => {
        if (!Array.isArray(row) || row.length < 5) return [];
        const close = Number(row[4]);
        return Number.isFinite(close) ? [close] : [];
      });
      if (closes.length >= 8) return closes;
    } catch {
      // Try the next Binance market-data host.
    }
  }
  return [];
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
