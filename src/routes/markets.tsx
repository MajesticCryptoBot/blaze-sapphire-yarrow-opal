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

const BINANCE_STOCKS = [
  { apiSymbol: "SPCXBUSDT", symbol: "SPCXB", name: "SpaceX (bStocks)" },
  { apiSymbol: "TSLABUSDT", symbol: "TSLAB", name: "Tesla (bStocks)" },
  { apiSymbol: "AAPLBUSDT", symbol: "AAPLB", name: "Apple (bStocks)" },
  { apiSymbol: "MSTRBUSDT", symbol: "MSTRB", name: "Strategy (bStocks)" },
  { apiSymbol: "NVDABUSDT", symbol: "NVDAB", name: "NVIDIA (bStocks)" },
] as const;

const BINANCE_DATA_URLS = [
  "https://data-api.binance.vision/api/v3/ticker/24hr",
  "https://api.binance.com/api/v3/ticker/24hr",
] as const;

function formatPrice(value: number) {
  if (value >= 1000) return value.toLocaleString("en-US", { maximumFractionDigits: 2 });
  if (value >= 1) return value.toLocaleString("en-US", { maximumFractionDigits: 4 });
  return value.toLocaleString("en-US", { maximumFractionDigits: 6 });
}

async function fetchBinanceStocks(): Promise<Market[]> {
  const symbols = JSON.stringify(BINANCE_STOCKS.map((item) => item.apiSymbol));

  for (const baseUrl of BINANCE_DATA_URLS) {
    try {
      const url = new URL(baseUrl);
      url.searchParams.set("symbols", symbols);

      const response = await fetch(url.toString(), {
        cache: "no-store",
        credentials: "omit",
        headers: { Accept: "application/json" },
      });

      if (!response.ok) continue;

      const payload = (await response.json()) as unknown;
      if (!Array.isArray(payload)) continue;

      const bySymbol = new Map<string, { price: number; change24h: number }>();
      for (const row of payload) {
        if (!row || typeof row !== "object") continue;
        const item = row as Record<string, unknown>;
        const apiSymbol = String(item.symbol ?? "");
        const price = Number(item.lastPrice);
        const change24h = Number(item.priceChangePercent);
        if (apiSymbol && Number.isFinite(price)) {
          bySymbol.set(apiSymbol, {
            price,
            change24h: Number.isFinite(change24h) ? change24h : 0,
          });
        }
      }

      const now = new Date().toISOString();
      return BINANCE_STOCKS.flatMap((stock) => {
        const quote = bySymbol.get(stock.apiSymbol);
        if (!quote) return [];
        return [{
          symbol: stock.symbol,
          name: stock.name,
          price: quote.price,
          change24h: quote.change24h,
          lastUpdated: now,
        }];
      });
    } catch {
      // Try the next official Binance public market-data host.
    }
  }

  return [];
}

function Markets() {
  const [markets, setMarkets] = useState<Market[]>([]);
  const [error, setError] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let active = true;
    const load = async () => {
      try {
        const [cmcResponse, binanceMarkets] = await Promise.all([
          fetch("/api/market-prices", { cache: "no-store" }),
          fetchBinanceStocks(),
        ]);

        if (!cmcResponse.ok) throw new Error("market request failed");
        const payload = (await cmcResponse.json()) as { data?: Market[] };
        const cmcMarkets = payload.data ?? [];

        if (active) {
          setMarkets([...cmcMarkets, ...binanceMarkets]);
          setError(cmcMarkets.length === 0 && binanceMarkets.length === 0);
        }
      } catch {
        if (active) setError(true);
      } finally {
        if (active) setLoaded(true);
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
        Spot tape
      </p>
      <h1 className="mt-3 font-display text-4xl font-medium">Markets</h1>
      <p className="mt-3 max-w-xl text-muted">
        Live USD quotes for Bitcoin, Ether, XRP, Solana, and BNB, plus Binance
        bStocks for SpaceX, Tesla, Apple, Strategy, and NVIDIA.
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
            {!loaded && markets.length === 0
              ? Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="border-t border-border">
                    <td className="px-4 py-4 text-sm text-subtle" colSpan={5}>
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
