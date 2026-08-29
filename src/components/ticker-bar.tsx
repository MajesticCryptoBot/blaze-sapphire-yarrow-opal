import { TICKERS } from "@/lib/markets";
import { cn } from "@/lib/utils";

export function TickerBar() {
  const loop = [...TICKERS, ...TICKERS];
  return (
    <div className="border-y border-border bg-surface">
      <div className="flex overflow-hidden">
        <div className="flex min-w-max animate-[ticker_42s_linear_infinite] motion-reduce:animate-none">
          {loop.map((t, i) => {
            const up = t.change >= 0;
            return (
              <div
                key={`${t.symbol}-${i}`}
                className="flex items-center gap-3 border-r border-border px-5 py-2.5"
              >
                <span className="font-mono text-[11px] font-semibold tracking-wide text-muted">
                  {t.symbol}
                </span>
                <span className="font-mono text-[12px] tabular-nums text-foreground">
                  {t.price.toLocaleString("en-US", { maximumFractionDigits: 2 })}
                </span>
                <span
                  className={cn(
                    "font-mono text-[11px] tabular-nums",
                    up ? "text-up" : "text-down",
                  )}
                >
                  {up ? "+" : ""}
                  {t.change.toFixed(2)}%
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
