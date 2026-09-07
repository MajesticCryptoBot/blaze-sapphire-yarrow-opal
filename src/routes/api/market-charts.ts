import { createFileRoute } from "@tanstack/react-router";
import { fetchMarketCharts, type ChartSeries } from "@/lib/market-charts";

const CACHE_TTL_MS = 180_000;

type CacheState = { expiresAt: number; data: ChartSeries[] };
const globalRef = globalThis as typeof globalThis & {
  __binanceChartCache__?: CacheState;
};

export const Route = createFileRoute("/api/market-charts")({
  server: {
    handlers: {
      GET: async () => {
        const now = Date.now();
        const cached = globalRef.__binanceChartCache__;

        if (cached && cached.expiresAt > now) {
          return Response.json(
            { data: cached.data, cached: true },
            { headers: { "Cache-Control": "public, s-maxage=180, stale-while-revalidate=300" } },
          );
        }

        try {
          const data = await fetchMarketCharts();
          globalRef.__binanceChartCache__ = { data, expiresAt: now + CACHE_TTL_MS };
          return Response.json(
            { data, cached: false },
            { headers: { "Cache-Control": "public, s-maxage=180, stale-while-revalidate=300" } },
          );
        } catch (error) {
          console.error("[market-charts]", error instanceof Error ? error.message : error);
          if (cached) {
            return Response.json(
              { data: cached.data, cached: true, stale: true },
              { headers: { "Cache-Control": "public, s-maxage=180, stale-while-revalidate=300" } },
            );
          }
          return Response.json({ data: [] }, { status: 200 });
        }
      },
    },
  },
});
