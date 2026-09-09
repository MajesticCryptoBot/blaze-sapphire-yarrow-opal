import { createFileRoute } from "@tanstack/react-router";
import { PRICE_REFRESH_MS, fetchBinanceMarkets, type MarketQuote } from "@/lib/binance-markets";

type CacheState = { expiresAt: number; data: MarketQuote[] };
const globalRef = globalThis as typeof globalThis & {
  __binanceMarketCache__?: CacheState;
};

export const Route = createFileRoute("/api/market-prices")({
  server: {
    handlers: {
      GET: async () => {
        const now = Date.now();
        const cached = globalRef.__binanceMarketCache__;

        if (cached && cached.expiresAt > now) {
          return Response.json(
            { data: cached.data, cached: true },
            { headers: { "Cache-Control": "public, s-maxage=5, stale-while-revalidate=15" } },
          );
        }

        try {
          const data = await fetchBinanceMarkets();
          if (data.length === 0) throw new Error("Binance returned no quotes");
          globalRef.__binanceMarketCache__ = { data, expiresAt: now + PRICE_REFRESH_MS };
          return Response.json(
            { data, cached: false },
            { headers: { "Cache-Control": "public, s-maxage=5, stale-while-revalidate=15" } },
          );
        } catch (error) {
          console.error("[market-prices]", error instanceof Error ? error.message : error);
          if (cached) {
            return Response.json(
              { data: cached.data, cached: true, stale: true },
              { headers: { "Cache-Control": "public, s-maxage=5, stale-while-revalidate=15" } },
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
