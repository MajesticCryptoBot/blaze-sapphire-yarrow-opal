import { useEffect, useState } from "react";
import { fetchMarketCharts, seriesMap } from "@/lib/market-charts";

export function useMarketCharts() {
  const [charts, setCharts] = useState<Record<string, number[]>>({});

  useEffect(() => {
    let active = true;

    const load = async () => {
      try {
        const response = await fetch("/api/market-charts", { cache: "no-store" });
        if (response.ok) {
          const payload = (await response.json()) as { data?: { symbol: string; closes: number[] }[] };
          const rows = payload.data ?? [];
          if (rows.length > 0) {
            if (active) setCharts(seriesMap(rows));
            return;
          }
        }
      } catch {
        // Fall through to a direct Binance public request from the browser.
      }

      try {
        const rows = await fetchMarketCharts();
        if (active) setCharts(seriesMap(rows));
      } catch {
        // Keep the last good sparkline visible.
      }
    };

    void load();
    const timer = window.setInterval(load, 30_000);
    return () => {
      active = false;
      window.clearInterval(timer);
    };
  }, []);

  return charts;
}
