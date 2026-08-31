// src/routes/api/market-prices.ts
import { createServerFn } from "@tanstack/react-start";
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

type CmcQuote = { symbol?: string; price?: number; percent_change_24h?: number; last_updated?: string };
type CmcAsset = { id: number; name: string; symbol: string; quote?: CmcQuote[] | { USD?: CmcQuote } };
type CmcPayload = { data?: Record<string, CmcAsset> | CmcAsset[]; status?: { error_code?: number | string; error_message?: string | null } };

function getUsdQuote(asset: CmcAsset): CmcQuote | undefined {
  const quote = asset.quote;
  if (Array.isArray(quote)) return quote.find((item) => item.symbol === "USD");
  return quote?.USD;
}

async function requestCmc(url: URL, apiKey?: string): Promise<CmcPayload> {
  const headers: Record<string, string> = { Accept: "application/json" };
  if (apiKey) headers["X-CMC_PRO_API_KEY"] = apiKey;

  const response = await fetch(url, { headers, cache: "no-store" });
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
  return payload;
}

function normalizePayload(payload: CmcPayload): Market[] {
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

  if (data.length !== ASSETS.length) throw new Error(`CoinMarketCap returned ${data.length}/${ASSETS.length} requested assets`);
  return data;
}

async function fetchMarkets(): Promise<Market[]> {
  const apiKey = process.env.CMC_API_KEY?.trim();
  console.log("🔵 [API] CMC_API_KEY exists:", !!apiKey);
  
  const query = ASSETS.map((asset) => asset.id).join(",");
  const authenticatedUrl = new URL("https://pro-api.coinmarketcap.com/v3/cryptocurrency/quotes/latest");
  authenticatedUrl.searchParams.set("id", query);
  authenticatedUrl.searchParams.set("convert", "USD");

  if (apiKey) {
    try {
      console.log("🔵 [API] Trying authenticated CMC request");
      return normalizePayload(await requestCmc(authenticatedUrl, apiKey));
    } catch (error) {
      console.warn("[market-prices] authenticated CMC request failed; using public feed", error instanceof Error ? error.message : error);
    }
  }

  console.log("🔵 [API] Trying public CMC request (no API key)");
  const publicUrl = new URL("https://pro-api.coinmarketcap.com/public-api/v3/cryptocurrency/quotes/latest");
  publicUrl.searchParams.set("id", query);
  publicUrl.searchParams.set("convert", "USD");
  return normalizePayload(await requestCmc(publicUrl));
}

export const getMarketPrices = createServerFn({
  method: "GET",
  handler: async () => {
    console.log("🔵 [API] getMarketPrices called");
    
    const now = Date.now();
    const cached = globalRef.__cmcMarketCache__;
    
    if (cached && cached.expiresAt > now) {
      console.log("🔵 [API] Returning cached data");
      return { data: cached.data, cached: true };
    }

    try {
      console.log("🔵 [API] Fetching fresh data");
      const data = await fetchMarkets();
      console.log("🔵 [API] Fetched", data.length, "markets");
      globalRef.__cmcMarketCache__ = { data, expiresAt: now + CACHE_TTL_MS };
      return { data, cached: false };
    } catch (error) {
      console.error("🔴 [API] Error:", error);
      if (cached) {
        return { data: cached.data, cached: true, stale: true };
      }
      throw new Error("Market data is temporarily unavailable");
    }
  },
});

export const Route = createFileRoute("/api/market-prices")({
  loader: async () => {
    console.log("🔵 [API] Route loader called");
    return getMarketPrices();
  },
});

export const component = () => {
  const data = Route.useLoaderData();
  return new Response(JSON.stringify(data), {
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-store",
    },
  });
};
