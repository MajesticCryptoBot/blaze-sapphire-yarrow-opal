import { Link, createFileRoute } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { Sparkline } from "@/components/sparkline";
import { LiveChart } from "@/components/live-chart";
import { useMarketCharts } from "@/components/use-market-charts";
import { PRICE_REFRESH_MS, fetchBinanceMarkets, type MarketQuote } from "@/lib/binance-markets";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/markets")({ component: Markets });

function formatPrice(value: number) {
  if (value >= 1000) return value.toLocaleString("en-US", { maximumFractionDigits: 2 });
  if (value >= 1) return value.toLocaleString("en-US", { maximumFractionDigits: 4 });
  return value.toLocaleString("en-US", { maximumFractionDigits: 6 });
}

function Markets() {
  const [markets, setMarkets] = useState<MarketQuote[]>([]);
  const [error, setError] = useState(false);
  const [loaded, setLoaded] = useState(false);
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
            if (active) {
              setMarkets(rows);
              setError(false);
              setLoaded(true);
            }
            return;
          }
        }
      } catch {
        // Fall through to a direct Binance public request.
      }

      try {
        const rows = await fetchBinanceMarkets();
        if (active) {
          setMarkets(rows);
          setError(rows.length === 0);
        }
      } catch {
        if (active) setError(true);
      } finally {
        if (active) setLoaded(true);
      }
    };

    void load();
    const timer = window.setInterval(load, PRICE_REFRESH_MS);
    return () => {
      active = false;
      window.clearInterval(timer);
    };
  }, []);

  return (
    <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
      <Link
        to="/"
        search={{ q: "" }}
        className="inline-flex h-11 items-center gap-2 text-sm text-muted transition-colors hover:text-azure"
      >
        <ArrowLeft className="size-4" />
        Back
      </Link>
      <p className="mt-6 font-mono text-[11px] uppercase tracking-[0.2em] text-subtle">
        Spot tape
      </p>
      <h1 className="mt-3 font-display text-4xl font-medium">Markets</h1>
      <p className="mt-3 max-w-xl text-muted">
        Live Binance quotes, refreshed every five seconds, for majors, alts, and bStocks.
      </p>

      <LiveChart className="mt-8" />

      <div className="mt-8 overflow-x-auto rounded-lg border border-border">
        <table className="w-full min-w-[720px] text-left">
          <thead className="bg-surface font-mono text-[11px] uppercase tracking-[0.12em] text-subtle">
            <tr>
              <th className="px-4 py-3 font-medium">Symbol</th>
              <th className="px-4 py-3 font-medium">Name</th>
              <th className="px-4 py-3 font-medium">24h</th>
              <th className="px-4 py-3 font-medium">Last</th>
              <th className="px-4 py-3 font-medium">Change</th>
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
                  <td className="px-4 py-4">
                    <Sparkline values={charts[market.symbol] ?? []} width={96} height={32} />
                  </td>
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
            {!loaded && markets.length === 0
              ? Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="border-t border-border">
                    <td className="px-4 py-4 text-sm text-subtle" colSpan={6}>
                      Loading the tape…
                    </td>
                  </tr>
                ))
              : null}
          </tbody>
        </table>
      </div>

      {error && markets.length === 0 && loaded ? (
        <p className="mt-5 text-sm text-muted">
          The tape is temporarily unavailable. Please try again shortly.
        </p>
      ) : null}
    </main>
  );
}
