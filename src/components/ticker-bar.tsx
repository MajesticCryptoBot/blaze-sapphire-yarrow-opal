import { useEffect, useMemo, useState } from "react";
import { cn } from "@/lib/utils";

type LiveMarket = {
  symbol: string;
  price: number;
  change24h: number;
};

const SYMBOLS = ["BTC", "ETH", "XRP", "SOL", "BNB"] as const;
const REFRESH_MS = 180_000;

function formatPrice(price: number) {
  if (price >= 1000) return price.toLocaleString("en-US", { maximumFractionDigits: 2 });
  if (price >= 1) return price.toLocaleString("en-US", { maximumFractionDigits: 4 });
  return price.toLocaleString("en-US", { maximumFractionDigits: 6 });
}

export function TickerBar() {
  const [liveMarkets, setLiveMarkets] = useState<LiveMarket[]>([]);

  useEffect(() => {
    let active = true;
    const load = async () => {
      try {
        const response = await fetch("/api/market-prices", { cache: "no-store" });
        if (!response.ok) throw new Error("market request failed");
        const payload = (await response.json()) as { data?: LiveMarket[] };
        if (active) setLiveMarkets(payload.data ?? []);
      } catch {
        // Keep last good tape visible.
      }
    };

    void load();
    const timer = window.setInterval(load, REFRESH_MS);
    return () => {
      active = false;
      window.clearInterval(timer);
    };
  }, []);

  const items = useMemo(() => {
    const liveBySymbol = new Map(liveMarkets.map((market) => [market.symbol, market]));
    return SYMBOLS.map((symbol) => {
      const live = liveBySymbol.get(symbol);
      return {
        symbol,
        price: live?.price ?? null,
        change: live?.change24h ?? null,
      };
    });
  }, [liveMarkets]);

  const loop = [...items, ...items];

  return (
    <div className="border-y border-border bg-surface">
      <div className="flex overflow-hidden">
        <div className="flex min-w-max animate-[ticker_24s_linear_infinite] motion-reduce:animate-none">
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
