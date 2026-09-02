import { createFileRoute } from "@tanstack/react-router";
import { CMC_ASSETS, parseCmcMarkets, type MarketQuote } from "@/lib/cmc-markets";

const CACHE_TTL_MS = 180_000;
const BINANCE_SYMBOLS = ["SPCXBUSDT", "TSLABUSDT", "AAPLBUSDT", "MSTRBUSDT", "NVDABUSDT"] as const;
const BINANCE_NAMES: Record<string, string> = {
  SPCXB: "SpaceX (bStocks)",
  TSLAB: "Tesla (bStocks)",
  AAPLB: "Apple (bStocks)",
  MSTRB: "Strategy (bStocks)",
  NVDAB: "NVIDIA (bStocks)",
};

type CacheState = { expiresAt: number; data: MarketQuote[] };
const globalRef = globalThis as typeof globalThis & {
  __cmcMarketCache__?: CacheState;
};

async function fetchCmcMarkets(): Promise<MarketQuote[]> {
  const apiKey = process.env.CMC_API_KEY?.trim();
  if (!apiKey) throw new Error("CMC_API_KEY is not configured in the server environment");

  const url = new URL("https://pro-api.coinmarketcap.com/v3/cryptocurrency/quotes/latest");
  url.searchParams.set("id", CMC_ASSETS.map((asset) => asset.id).join(","));
  url.searchParams.set("convert", "USD");

  const response = await fetch(url, {
    headers: { "X-CMC_PRO_API_KEY": apiKey, Accept: "application/json" },
    cache: "no-store",
  });

  const rawText = await response.text();
  let payload: unknown = {};
  try {
    payload = JSON.parse(rawText) as unknown;
  } catch {
    throw new Error(`CoinMarketCap returned non-JSON HTTP ${response.status}`);
  }

  if (!response.ok) {
    throw new Error(`CoinMarketCap HTTP ${response.status}: ${rawText.slice(0, 300)}`);
  }

  return parseCmcMarkets(payload);
}

async function fetchBinanceTicker(symbol: string): Promise<Record<string, unknown> | null> {
  // Use Binance's primary Spot API. bStocks are Spot instruments and are not
  // guaranteed to be exposed identically through the data-api hostname.
  const url = new URL("https://api.binance.com/api/v3/ticker/24hr");
  url.searchParams.set("symbol", symbol);

  const response = await fetch(url, {
    headers: { Accept: "application/json" },
    cache: "no-store",
  });

  const rawText = await response.text();
  let payload: unknown;
  try {
    payload = JSON.parse(rawText) as unknown;
  } catch {
    throw new Error(`Binance returned non-JSON HTTP ${response.status} for ${symbol}`);
  }

  if (!response.ok) {
    throw new Error(`Binance HTTP ${response.status} for ${symbol}: ${rawText.slice(0, 250)}`);
  }

  if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
    throw new Error(`Binance returned an unexpected ticker response for ${symbol}`);
  }

  return payload as Record<string, unknown>;
}

async function fetchBinanceStocks(): Promise<MarketQuote[]> {
  const results = await Promise.allSettled(BINANCE_SYMBOLS.map((symbol) => fetchBinanceTicker(symbol)));
  const output: MarketQuote[] = [];

  results.forEach((result, index) => {
    const symbol = BINANCE_SYMBOLS[index];
    const baseSymbol = symbol.slice(0, -4);

    if (result.status === "rejected") {
      console.warn(
        `[market-prices] Binance ${symbol} failed:`,
        result.reason instanceof Error ? result.reason.message : result.reason,
      );
      return;
    }

    const row = result.value;
    const rawPrice = row?.lastPrice;
    const rawChange = row?.priceChangePercent;
    const price = typeof rawPrice === "string" ? Number(rawPrice) : typeof rawPrice === "number" ? rawPrice : NaN;
    const change24h = typeof rawChange === "string" ? Number(rawChange) : typeof rawChange === "number" ? rawChange : 0;

    if (!Number.isFinite(price)) {
      console.warn(`[market-prices] Binance returned no valid price for ${symbol}`);
      return;
    }

    output.push({
      symbol: baseSymbol,
      name: BINANCE_NAMES[baseSymbol] ?? `${baseSymbol} (bStocks)`,
      price,
      change24h: Number.isFinite(change24h) ? change24h : 0,
      lastUpdated: new Date().toISOString(),
    });
  });

  if (output.length === 0) {
    throw new Error("Binance returned no usable bStocks prices");
  }

  return output;
}

export const Route = createFileRoute("/api/market-prices")({
  server: {
    handlers: {
      GET: async () => {
        const now = Date.now();
        const cached = globalRef.__cmcMarketCache__;

        if (cached && cached.expiresAt > now) {
          return Response.json(
            { data: cached.data, cached: true },
            { headers: { "Cache-Control": "public, s-maxage=180, stale-while-revalidate=300" } },
          );
        }

        try {
          const [cmcResult, binanceResult] = await Promise.allSettled([
            fetchCmcMarkets(),
            fetchBinanceStocks(),
          ]);

          const cmcData = cmcResult.status === "fulfilled" ? cmcResult.value : null;
          const binanceData = binanceResult.status === "fulfilled" ? binanceResult.value : [];

          if (!cmcData) {
            throw cmcResult.status === "rejected" ? cmcResult.reason : new Error("CoinMarketCap unavailable");
          }

          if (binanceResult.status === "rejected") {
            console.warn(
              "[market-prices] Binance unavailable:",
              binanceResult.reason instanceof Error ? binanceResult.reason.message : binanceResult.reason,
            );
          }

          const data = [...cmcData, ...binanceData];
          globalRef.__cmcMarketCache__ = { data, expiresAt: now + CACHE_TTL_MS };

          return Response.json(
            { data, cached: false },
            { headers: { "Cache-Control": "public, s-maxage=180, stale-while-revalidate=300" } },
          );
        } catch (error) {
          console.error("[market-prices]", error instanceof Error ? error.message : error);
          if (cached) {
            return Response.json(
              { data: cached.data, cached: true, stale: true },
              { headers: { "Cache-Control": "public, s-maxage=180, stale-while-revalidate=300" } },
            );
          }
          return Response.json(
            { error: "Market data is temporarily unavailable" },
            { status: 503 },
          );
        }
      },
    },
  },
});
