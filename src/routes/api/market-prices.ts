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

const BINANCE_BASE_URLS = [
  "https://data-api.binance.vision",
  "https://api-gcp.binance.com",
  "https://api.binance.com",
  "https://api1.binance.com",
  "https://api2.binance.com",
  "https://api3.binance.com",
  "https://api4.binance.com",
] as const;

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

async function fetchBinanceStocks(): Promise<MarketQuote[]> {
  const symbolsParam = JSON.stringify([...BINANCE_SYMBOLS]);
  const failures: string[] = [];

  for (const baseUrl of BINANCE_BASE_URLS) {
    try {
      const url = new URL(`${baseUrl}/api/v3/ticker/24hr`);
      url.searchParams.set("symbols", symbolsParam);

      const response = await fetch(url, {
        headers: {
          Accept: "application/json",
          "User-Agent": "ASP-News-Market-Feed/1.0",
        },
        cache: "no-store",
        signal: AbortSignal.timeout(8000),
      });

      const rawText = await response.text();
      let payload: unknown;
      try {
        payload = JSON.parse(rawText) as unknown;
      } catch {
        failures.push(`${baseUrl}: HTTP ${response.status}, non-JSON`);
        continue;
      }

      if (!response.ok || !Array.isArray(payload)) {
        const detail =
          typeof payload === "object" && payload !== null && "msg" in payload
            ? String((payload as { msg?: unknown }).msg ?? "")
            : rawText.slice(0, 120);
        failures.push(`${baseUrl}: HTTP ${response.status} ${detail}`);
        continue;
      }

      const bySymbol = new Map<string, Record<string, unknown>>();
      for (const row of payload) {
        if (!row || typeof row !== "object") continue;
        const item = row as Record<string, unknown>;
        const symbol = String(item.symbol ?? "");
        if (symbol) bySymbol.set(symbol, item);
      }

      const output: MarketQuote[] = [];
      for (const symbol of BINANCE_SYMBOLS) {
        const row = bySymbol.get(symbol);
        if (!row) continue;
        const price = Number(row.lastPrice);
        const change24h = Number(row.priceChangePercent);
        if (!Number.isFinite(price)) continue;
        const baseSymbol = symbol.slice(0, -4);
        output.push({
          symbol: baseSymbol,
          name: BINANCE_NAMES[baseSymbol] ?? `${baseSymbol} (bStocks)`,
          price,
          change24h: Number.isFinite(change24h) ? change24h : 0,
          lastUpdated: new Date().toISOString(),
        });
      }

      if (output.length === 0) {
        failures.push(`${baseUrl}: no usable bStocks prices`);
        continue;
      }

      return output;
    } catch (error) {
      failures.push(`${baseUrl}: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  throw new Error(`Binance bStocks unavailable: ${failures.join(" | ")}`);
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
