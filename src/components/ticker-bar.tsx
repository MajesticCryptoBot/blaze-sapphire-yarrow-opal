import { useEffect, useMemo, useState } from "react";
import { cn } from "@/lib/utils";

type LiveMarket = {
  symbol: string;
  price: number;
  change24h: number;
};

const CRYPTO_SYMBOLS = ["BTC", "ETH", "XRP", "SOL", "BNB"] as const;
const BSTOCKS = [
  { apiSymbol: "SPCXBUSDT", symbol: "SPCXB" },
  { apiSymbol: "TSLABUSDT", symbol: "TSLAB" },
  { apiSymbol: "AAPLBUSDT", symbol: "AAPLB" },
  { apiSymbol: "MSTRBUSDT", symbol: "MSTRB" },
  { apiSymbol: "NVDABUSDT", symbol: "NVDAB" },
] as const;
const SYMBOLS = [...CRYPTO_SYMBOLS, ...BSTOCKS.map((item) => item.symbol)];
const REFRESH_MS = 180_000;
const BINANCE_DATA_URLS = [
  "https://data-api.binance.vision/api/v3/ticker/24hr",
  "https://api.binance.com/api/v3/ticker/24hr",
] as const;

function formatPrice(price: number) {
  if (price >= 1000) return price.toLocaleString("en-US", { maximumFractionDigits: 2 });
  if (price >= 1) return price.toLocaleString("en-US", { maximumFractionDigits: 4 });
  return price.toLocaleString("en-US", { maximumFractionDigits: 6 });
}

async function fetchBinanceStocks(): Promise<LiveMarket[]> {
  const symbols = JSON.stringify(BSTOCKS.map((item) => item.apiSymbol));

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

      return BSTOCKS.flatMap((stock) => {
        const quote = bySymbol.get(stock.apiSymbol);
        if (!quote) return [];
        return [{ symbol: stock.symbol, price: quote.price, change24h: quote.change24h }];
      });
    } catch {
      // Try the next official Binance public market-data host.
    }
  }

  return [];
}

export function TickerBar() {
  const [liveMarkets, setLiveMarkets] = useState<LiveMarket[]>([]);

  useEffect(() => {
    let active = true;
    const load = async () => {
      try {
        const [cmcResponse, binanceStocks] = await Promise.all([
          fetch("/api/market-prices", { cache: "no-store" }),
          fetchBinanceStocks(),
        ]);
        if (!cmcResponse.ok) throw new Error("market request failed");

        const payload = (await cmcResponse.json()) as { data?: LiveMarket[] };
        const cmcMarkets = payload.data ?? [];
        const combined = [...cmcMarkets, ...binanceStocks];

        if (active) setLiveMarkets(combined);
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
    <div className="border-y border-border bg-surface md:pl-12">
      <div className="flex overflow-hidden">
        <div className="flex min-w-max animate-[ticker_36s_linear_infinite] motion-reduce:animate-none">
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
