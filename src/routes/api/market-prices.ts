// src/routes/api/market-prices.ts
import { createFileRoute } from "@tanstack/react-router";

const ASSETS = [
  { id: 1, symbol: "BTC", name: "Bitcoin" },
  { id: 1027, symbol: "ETH", name: "Ethereum" },
  { id: 52, symbol: "XRP", name: "XRP" },
  { id: 5426, symbol: "SOL", name: "Solana" },
  { id: 1839, symbol: "BNB", name: "BNB" },
] as const;

type Market = { symbol: string; name: string; price: number; change24h: number; lastUpdated: string };
type CacheState = { expiresAt: number; data: Market[] };
const globalRef = globalThis as typeof globalThis & { __cmcMarketCache__?: CacheState };
const CACHE_TTL_MS = 180_000;

export const Route = createFileRoute("/api/market-prices")({
  loader: async () => {
    console.log("🔵 [API] /api/market-prices called");
    console.log("🔵 [API] CMC_API_KEY exists:", !!process.env.CMC_API_KEY);
    
    const now = Date.now();
    const cached = globalRef.__cmcMarketCache__;
    if (cached && cached.expiresAt > now) {
      console.log("🔵 [API] Returning cached data");
      return Response.json({ data: cached.data, cached: true });
    }

    try {
      const apiKey = process.env.CMC_API_KEY?.trim();
      const query = ASSETS.map((asset) => asset.id).join(",");
      
      // Try authenticated request
      const url = new URL("https://pro-api.coinmarketcap.com/v3/cryptocurrency/quotes/latest");
      url.searchParams.set("id", query);
      url.searchParams.set("convert", "USD");
      
      console.log("🔵 [API] Fetching from CMC");
      
      const headers: Record<string, string> = { Accept: "application/json" };
      if (apiKey) headers["X-CMC_PRO_API_KEY"] = apiKey;

      const response = await fetch(url.toString(), { headers });
      
      if (!response.ok) {
        console.error("🔴 [API] CMC HTTP error:", response.status);
        throw new Error(`CMC HTTP ${response.status}`);
      }

      const data = await response.json();
      console.log("🔵 [API] CMC response received");

      // Parse the response
      const markets: Market[] = [];
      const cmcData = data.data || {};
      
      for (const asset of ASSETS) {
        const coin = cmcData[asset.symbol];
        if (coin && coin.quote?.USD) {
          markets.push({
            symbol: asset.symbol,
            name: asset.name,
            price: coin.quote.USD.price,
            change24h: coin.quote.USD.percent_change_24h || 0,
            lastUpdated: coin.quote.USD.last_updated || new Date().toISOString(),
          });
        }
      }

      globalRef.__cmcMarketCache__ = { data: markets, expiresAt: now + CACHE_TTL_MS };
      console.log("🔵 [API] Returning", markets.length, "markets");
      
      return Response.json({ data: markets, cached: false });

    } catch (error) {
      console.error("🔴 [API] Error:", error);
      if (cached) {
        return Response.json({ data: cached.data, cached: true, stale: true });
      }
      return Response.json(
        { error: "Market data is temporarily unavailable" },
        { status: 503 }
      );
    }
  },
});

// This handles the actual HTTP response
export const component = () => {
  const data = Route.useLoaderData();
  return data; // Return the Response object from loader
};
