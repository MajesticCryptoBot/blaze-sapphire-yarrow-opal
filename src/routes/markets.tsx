import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/markets")({ component: Markets });

type Market = {
  symbol: string;
  name: string;
  price: number;
  change24h: number;
  lastUpdated: string | null;
};

function formatPrice(value: number) {
  if (value >= 1000) return value.toLocaleString("en-US", { maximumFractionDigits: 2 });
  if (value >= 1) return value.toLocaleString("en-US", { maximumFractionDigits: 4 });
  return value.toLocaleString("en-US", { maximumFractionDigits: 6 });
}

function Markets() {
  const [markets, setMarkets] = useState<Market[]>([]);
  const [error, setError] = useState(false);

  useEffect(() => {
    let active = true;
    const load = async () => {
      try {
        const response = await fetch("/api/market-prices", { cache: "no-store" });
        if (!response.ok) throw new Error("market request failed");
        const payload = (await response.json()) as { data?: Market[] };
        if (active) {
          setMarkets(payload.data ?? []);
          setError(false);
        }
      } catch {
        if (active) setError(true);
      }
    };

    void load();
    const timer = window.setInterval(load, 180_000);
    return () => {
      active = false;
      window.clearInterval(timer);
    };
  }, []);

  return (
    <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
      <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-subtle">
        Live market tape
      </p>
      <h1 className="mt-3 font-display text-4xl font-medium">Markets</h1>
      <p className="mt-3 max-w-xl text-muted">
        Live CoinMarketCap prices for BTC, ETH, XRP, SOL, and BNB. The server
        caches the feed for three minutes so visitors share the same API request.
      </p>

      <div className="mt-8 overflow-x-auto rounded-lg border border-border">
        <table className="w-full min-w-[620px] text-left">
          <thead className="bg-surface font-mono text-[11px] uppercase tracking-[0.12em] text-subtle">
            <tr>
              <th className="px-4 py-3 font-medium">Symbol</th>
              <th className="px-4 py-3 font-medium">Name</th>
              <th className="px-4 py-3 font-medium">Last</th>
              <th className="px-4 py-3 font-medium">24h</th>
              <th className="px-4 py-3 font-medium">Updated</th>
            </tr>
          </thead>
          <tbody>
            {markets.map((market) => {
              const up = market.change24h >= 0;
              return (
                <tr key={market.symbol} className="border-t border-border">
                  <td className="px-4 py-4 font-mono text-sm font-semibold">{market.symbol}</td>
                  <td className="px-4 py-4 text-sm text-muted">{market.name}</td>
                  <td className="px-4 py-4 font-mono text-sm tabular-nums">${formatPrice(market.price)}</td>
                  <td className={cn("px-4 py-4 font-mono text-sm tabular-nums", up ? "text-up" : "text-down")}>
                    {up ? "+" : ""}{market.change24h.toFixed(2)}%
                  </td>
                  <td className="px-4 py-4 text-xs text-muted">
                    {market.lastUpdated ? new Date(market.lastUpdated).toLocaleTimeString() : "—"}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {error && markets.length === 0 ? (
        <p className="mt-5 text-sm text-muted">
          Live market data is unavailable. Configure CMC_API_KEY in Vercel.
        </p>
      ) : null}
    </main>
  );
}
