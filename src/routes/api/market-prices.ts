import { createFileRoute } from "@tanstack/react-router";

const ASSETS = [
  { id: 1, symbol: "BTC", name: "Bitcoin" },
  { id: 1027, symbol: "ETH", name: "Ethereum" },
  { id: 52, symbol: "XRP", name: "XRP" },
  { id: 5426, symbol: "SOL", name: "Solana" },
  { id: 1839, symbol: "BNB", name: "BNB" },
] as const;

const CACHE_TTL_MS = 180_000;
type Market = { symbol: string; name: string; price: number; change24h: number; lastUpdated: string };
type CacheState = { expiresAt: number; data: Market[] };
const globalRef = globalThis as typeof globalThis & { __cmcMarketCache__?: CacheState };

type CmcQuote = {
  symbol?: string;
  price?: number;
  percent_change_24h?: number;
  last_updated?: string;
};

type CmcAsset = {
  id: number;
  name: string;
  symbol: string;
  quote?: CmcQuote[] | { USD?: CmcQuote };
};

type CmcPayload = {
  data?: Record<string, CmcAsset> | CmcAsset[];
  status?: {
    error_code?: number | string;
    error_message?: string | null;
  };
};

function getUsdQuote(asset: CmcAsset): CmcQuote | undefined {
  const quote = asset.quote;
  if (Array.isArray(quote)) {
    return quote.find((item) => item.symbol === "USD");
  }
  return quote?.USD;
}

async function fetchMarkets(): Promise<Market[]> {
  const apiKey = process.env.CMC_API_KEY?.trim();
  if (!apiKey) throw new Error("CMC_API_KEY is not configured in the server environment");

  const url = new URL("https://pro-api.coinmarketcap.com/v3/cryptocurrency/quotes/latest");
  url.searchParams.set("id", ASSETS.map((asset) => asset.id).join(","));
  url.searchParams.set("convert", "USD");

  const response = await fetch(url, {
    headers: { "X-CMC_PRO_API_KEY": apiKey, Accept: "application/json" },
    cache: "no-store",
  });

  const rawText = await response.text();
  let payload: CmcPayload = {};
  try {
    payload = JSON.parse(rawText) as CmcPayload;
  } catch {
    throw new Error(`CoinMarketCap returned non-JSON HTTP ${response.status}`);
  }

  const errorCode = payload.status?.error_code;
  const errorMessage = payload.status?.error_message;
  if (!response.ok || (errorCode !== undefined && String(errorCode) !== "0")) {
    const detail = errorMessage ? `: ${errorMessage}` : "";
    throw new Error(`CoinMarketCap HTTP ${response.status}${errorCode !== undefined ? ` (code ${errorCode})` : ""}${detail}`);
  }

  const rawData = payload.data ?? {};
  const assets = Array.isArray(rawData) ? rawData : Object.values(rawData);
  const byId = new Map(assets.map((asset) => [asset.id, asset]));
  const data: Market[] = [];

  for (const asset of ASSETS) {
    const coin = byId.get(asset.id);
    const quote = coin ? getUsdQuote(coin) : undefined;

    if (!coin || typeof quote?.price !== "number") continue;

    data.push({
      symbol: asset.symbol,
      name: asset.name,
      price: quote.price,
      change24h: typeof quote.percent_change_24h === "number" ? quote.percent_change_24h : 0,
      lastUpdated: quote.last_updated ?? new Date().toISOString(),
    });
  }

  if (data.length !== ASSETS.length) {
    throw new Error(`CoinMarketCap returned ${data.length}/${ASSETS.length} requested assets`);
  }

  return data;
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
            { headers: { "Cache-Control": "no-store" } },
          );
        }

        try {
          const data = await fetchMarkets();
          globalRef.__cmcMarketCache__ = { data, expiresAt: now + CACHE_TTL_MS };

          return Response.json(
            { data, cached: false },
            { headers: { "Cache-Control": "no-store" } },
          );
        } catch (error) {
          if (cached) {
            return Response.json(
              { data: cached.data, cached: true, stale: true },
              { headers: { "Cache-Control": "no-store" } },
            );
          }

          console.error("[market-prices]", error instanceof Error ? error.message : error);
          return Response.json(
            { error: "Market data is temporarily unavailable" },
            { status: 503 },
          );
        }
      },
    },
  },
});
