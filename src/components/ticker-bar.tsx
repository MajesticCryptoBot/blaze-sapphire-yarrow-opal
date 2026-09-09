import { useEffect, useMemo, useState } from "react";
import { Sparkline } from "@/components/sparkline";
import { useMarketCharts } from "@/components/use-market-charts";
import { BINANCE_ASSETS, PRICE_REFRESH_MS, fetchBinanceMarkets, type MarketQuote } from "@/lib/binance-markets";
import { cn } from "@/lib/utils";

function formatPrice(price: number) {
  if (price >= 1000) return price.toLocaleString("en-US", { maximumFractionDigits: 2 });
  if (price >= 1) return price.toLocaleString("en-US", { maximumFractionDigits: 4 });
  return price.toLocaleString("en-US", { maximumFractionDigits: 6 });
}

export function TickerBar() {
  const [liveMarkets, setLiveMarkets] = useState<MarketQuote[]>([]);
  const charts = useMarketCharts();

  useEffect(() => {
    let active = true;
    const load = async () => {
      try {
        const response = await fetch("/api/market-prices", { cache: "no-store" });
        if (response.ok) {
          const payload = (await response.json()) as { data?: MarketQuote[] };
          const rows = payload.data ?? [];
          if (rows.length > 0) {
            if (active) setLiveMarkets(rows);
            return;
          }
        }
      } catch {
        // Fall through to a direct Binance public request.
      }

      try {
        const rows = await fetchBinanceMarkets();
        if (active && rows.length > 0) setLiveMarkets(rows);
      } catch {
        // Keep last good tape visible.
      }
    };

    void load();
    const timer = window.setInterval(load, PRICE_REFRESH_MS);
    return () => {
      active = false;
      window.clearInterval(timer);
    };
  }, []);

  const items = useMemo(() => {
    const liveBySymbol = new Map(liveMarkets.map((market) => [market.symbol, market]));
    return BINANCE_ASSETS.map((asset) => {
      const live = liveBySymbol.get(asset.symbol);
      return {
        symbol: asset.symbol,
        price: live?.price ?? null,
        change: live?.change24h ?? null,
      };
    });
  }, [liveMarkets]);

  const loop = [...items, ...items];

  return (
    <div className="border-y border-border bg-surface md:pl-12">
      <div className="flex overflow-hidden">
        <div className="flex min-w-max animate-[ticker_56s_linear_infinite] motion-reduce:animate-none">
          {loop.map((t, i) => {
            const up = (t.change ?? 0) >= 0;
            return (
              <div
                key={`${t.symbol}-${i}`}
                className="flex items-center gap-3 border-r border-border px-5 py-2.5"
              >
                <span className="font-mono text-[11px] font-semibold tracking-wide text-muted">
                  {t.symbol}
                </span>
                <span className="font-mono text-[12px] tabular-nums text-foreground">
                  {t.price == null ? "—" : `$${formatPrice(t.price)}`}
                </span>
                <Sparkline values={charts[t.symbol] ?? []} width={64} height={22} />
                {t.change != null ? (
                  <span
                    className={cn(
                      "font-mono text-[11px] tabular-nums",
                      up ? "text-up" : "text-down",
                    )}
                  >
                    {up ? "+" : ""}
                    {t.change.toFixed(2)}%
                  </span>
                ) : null}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
