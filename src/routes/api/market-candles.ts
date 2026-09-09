import { createFileRoute } from "@tanstack/react-router";
import { BINANCE_ASSETS } from "@/lib/binance-markets";
import { fetchPairCandles, type Candle } from "@/lib/market-charts";

const CACHE_TTL_MS = 30_000;
const SYMBOLS = new Set(BINANCE_ASSETS.filter((asset) => asset.group === "crypto").map((asset) => asset.symbol));

type CacheState = { expiresAt: number; data: Record<string, Candle[]> };
const globalRef = globalThis as typeof globalThis & {
  __binanceCandleCache__?: CacheState;
};

export const Route = createFileRoute("/api/market-candles")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const symbol = new URL(request.url).searchParams.get("symbol")?.toUpperCase() ?? "BTC";
        if (!SYMBOLS.has(symbol)) {
          return Response.json({ error: "Unknown symbol" }, { status: 400 });
        }

        const now = Date.now();
        const cached = globalRef.__binanceCandleCache__;
        if (cached && cached.expiresAt > now && cached.data[symbol]?.length) {
          return Response.json(
            { symbol, candles: cached.data[symbol], cached: true },
            { headers: { "Cache-Control": "public, s-maxage=180, stale-while-revalidate=300" } },
          );
        }

        try {
          const candles = await fetchPairCandles(symbol);
          const next = { ...(cached?.data ?? {}), [symbol]: candles };
          globalRef.__binanceCandleCache__ = { data: next, expiresAt: now + CACHE_TTL_MS };
          return Response.json(
            { symbol, candles, cached: false },
            { headers: { "Cache-Control": "public, s-maxage=180, stale-while-revalidate=300" } },
          );
        } catch (error) {
          console.error("[market-candles]", error instanceof Error ? error.message : error);
          if (cached?.data[symbol]?.length) {
            return Response.json(
              { symbol, candles: cached.data[symbol], cached: true, stale: true },
              { headers: { "Cache-Control": "public, s-maxage=180, stale-while-revalidate=300" } },
            );
          }
          return Response.json({ symbol, candles: [] });
        }
      },
    },
  },
});
