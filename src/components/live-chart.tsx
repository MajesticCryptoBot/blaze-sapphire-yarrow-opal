import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

const PAIRS = [
  { symbol: "BTC", tv: "BINANCE:BTCUSDT" },
  { symbol: "ETH", tv: "BINANCE:ETHUSDT" },
  { symbol: "XRP", tv: "BINANCE:XRPUSDT" },
  { symbol: "SOL", tv: "BINANCE:SOLUSDT" },
  { symbol: "BNB", tv: "BINANCE:BNBUSDT" },
] as const;

export function LiveChart({ className }: { className?: string }) {
  const [pair, setPair] = useState<(typeof PAIRS)[number]>(PAIRS[0]);
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    host.replaceChildren();
    const widget = document.createElement("div");
    widget.className = "tradingview-widget-container__widget";
    widget.style.height = "100%";
    widget.style.width = "100%";

    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
    script.async = true;
    script.type = "text/javascript";
    script.text = JSON.stringify({
      autosize: true,
      symbol: pair.tv,
      interval: "15",
      timezone: "Etc/UTC",
      theme: "dark",
      style: "1",
      locale: "en",
      backgroundColor: "#121214",
      gridColor: "rgba(38, 38, 43, 0.45)",
      hide_top_toolbar: false,
      hide_legend: false,
      hide_side_toolbar: true,
      allow_symbol_change: true,
      save_image: false,
      calendar: false,
      hide_volume: false,
      support_host: "https://www.tradingview.com",
    });

    host.append(widget, script);
    return () => {
      host.replaceChildren();
    };
  }, [pair]);

  return (
    <div className={cn("overflow-hidden rounded-md border border-border bg-surface", className)}>
      <div className="flex items-center justify-between gap-3 border-b border-border px-3 py-2">
        <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-subtle">Live chart</p>
        <div className="flex gap-1 overflow-x-auto">
          {PAIRS.map((item) => (
            <button
              key={item.symbol}
              type="button"
              onClick={() => setPair(item)}
              className={cn(
                "h-8 shrink-0 rounded-sm px-2 font-mono text-[11px]",
                pair.symbol === item.symbol
                  ? "bg-primary text-primary-foreground"
                  : "text-muted hover:text-foreground",
              )}
            >
              {item.symbol}
            </button>
          ))}
        </div>
      </div>
      <div ref={hostRef} className="h-[280px] w-full sm:h-[320px]" />
    </div>
  );
}
