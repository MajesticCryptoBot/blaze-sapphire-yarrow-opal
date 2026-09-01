import { createFileRoute } from "@tanstack/react-router";
import { CMC_ASSETS, parseCmcMarkets, type MarketQuote } from "@/lib/cmc-markets";

const CACHE_TTL_MS = 180_000;
type CacheState = { expiresAt: number; data: MarketQuote[] };
const globalRef = globalThis as typeof globalThis & { __cmcMarketCache__?: CacheState };

async function fetchMarkets(): Promise<MarketQuote[]> {
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
          console.error("[market-prices]", error instanceof Error ? error.message : error);
          if (cached) {
            return Response.json(
              { data: cached.data, cached: true, stale: true },
              { headers: { "Cache-Control": "no-store" } },
            );
          }
          return Response.json(
            { error: error instanceof Error ? error.message : "Market data is temporarily unavailable" },
            { status: 503 },
          );
        }
      },
    },
  },
});
