import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

type Market = {
  symbol: string;
  name: string;
  price: number;
  change24h: number;
  lastUpdated: string | null;
};

const FALLBACK_TICKERS: Market[] = [
  { symbol: "BTC", name: "Bitcoin", price: 0, change24h: 0, lastUpdated: null },
  { symbol: "ETH", name: "Ethereum", price: 0, change24h: 0, lastUpdated: null },
  { symbol: "XRP", name: "XRP", price: 0, change24h: 0, lastUpdated: null },
  { symbol: "SOL", name: "Solana", price: 0, change24h: 0, lastUpdated: null },
  { symbol: "BNB", name: "BNB", price: 0, change24h: 0, lastUpdated: null },
];

const REFRESH_MS = 180_000;

function formatPrice(value: number) {
  if (value >= 1000) {
    return `$${value.toLocaleString("en-US", { maximumFractionDigits: 2 })}`;
  }
  if (value >= 1) {
    return `$${value.toLocaleString("en-US", { maximumFractionDigits: 4 })}`;
  }
  return `$${value.toLocaleString("en-US", { maximumFractionDigits: 6 })}`;
}

export function TickerBar() {
  const [tickers, setTickers] = useState<Market[]>(FALLBACK_TICKERS);

  useEffect(() => {
    let active = true;

    const load = async () => {
      try {
        const response = await fetch("/api/market-prices", { cache: "no-store" });
        if (!response.ok) throw new Error("market request failed");
        const payload = (await response.json()) as { data?: Market[] };
        if (active && payload.data?.length) {
          setTickers(payload.data);
        }
      } catch {
        // Keep the last successful prices visible during a temporary API failure.
      }
    };

    void load();
    const timer = window.setInterval(load, REFRESH_MS);
    return () => {
      active = false;
      window.clearInterval(timer);
    };
  }, []);

  // Duplicate the sequence so the CSS marquee can loop continuously.
  const loop = [...tickers, ...tickers];

  return (
    <div className="border-y border-border bg-surface" aria-label="Live cryptocurrency prices">
      <div className="flex overflow-hidden">
        <div className="flex min-w-max animate-[ticker_42s_linear_infinite] motion-reduce:animate-none">
          {loop.map((ticker, index) => {
            const up = ticker.change24h >= 0;
            const hasPrice = ticker.price > 0;

            return (
              <div
                key={`${ticker.symbol}-${index}`}
                className="flex items-center gap-3 border-r border-border px-5 py-2.5"
              >
                <span className="font-mono text-[11px] font-semibold tracking-wide text-muted">
                  {ticker.symbol}
                </span>
                <span className="font-mono text-[12px] tabular-nums text-foreground">
                  {hasPrice ? formatPrice(ticker.price) : "—"}
                </span>
                <span
                  className={cn(
                    "font-mono text-[11px] tabular-nums",
                    up ? "text-up" : "text-down",
                  )}
                >
                  {hasPrice ? `${up ? "+" : ""}${ticker.change24h.toFixed(2)}%` : "—"}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
