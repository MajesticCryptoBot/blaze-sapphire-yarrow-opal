import { createFileRoute } from "@tanstack/react-router";
import { fetchMarketCalendar, type CalendarEvent } from "@/lib/market-calendar";

const CACHE_TTL_MS = 15 * 60 * 1000;

type CacheState = { expiresAt: number; data: CalendarEvent[] };
const globalRef = globalThis as typeof globalThis & {
  __marketCalendarCache__?: CacheState;
};

export const Route = createFileRoute("/api/market-calendar")({
  server: {
    handlers: {
      GET: async () => {
        const now = Date.now();
        const cached = globalRef.__marketCalendarCache__;
        if (cached && cached.expiresAt > now) {
          return Response.json({ data: cached.data, cached: true, source: "macro-diary" });
        }
        try {
          const data = await fetchMarketCalendar();
          globalRef.__marketCalendarCache__ = { data, expiresAt: now + CACHE_TTL_MS };
          return Response.json({ data, cached: false, source: "macro-diary" });
        } catch (error) {
          console.error("[market-calendar]", error instanceof Error ? error.message : error);
          if (cached) {
            return Response.json({ data: cached.data, cached: true, stale: true, source: "macro-diary" });
          }
          return Response.json({ error: "Calendar is temporarily unavailable" }, { status: 503 });
        }
      },
    },
  },
});
