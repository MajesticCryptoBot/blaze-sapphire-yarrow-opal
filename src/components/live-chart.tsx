import { useEffect, useMemo, useState } from "react";
import { fetchPairCandles, type Candle } from "@/lib/market-charts";
import { cn } from "@/lib/utils";

const PAIRS = ["BTC", "ETH", "XRP", "SOL", "BNB"] as const;
const WIDTH = 720;
const HEIGHT = 280;
const PAD_RIGHT = 64;
const PAD_BOTTOM = 22;
const PAD_TOP = 12;
const PAD_LEFT = 8;

function formatPrice(value: number) {
  if (value >= 1000) return value.toLocaleString("en-US", { maximumFractionDigits: 2 });
  if (value >= 1) return value.toLocaleString("en-US", { maximumFractionDigits: 4 });
  return value.toLocaleString("en-US", { maximumFractionDigits: 6 });
}

function formatTime(unix: number) {
  return new Date(unix * 1000).toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "UTC",
  });
}

function CandlePlot({ candles }: { candles: Candle[] }) {
  const plot = useMemo(() => {
    const lows = candles.map((c) => c.low);
    const highs = candles.map((c) => c.high);
    const min = Math.min(...lows);
    const max = Math.max(...highs);
    const span = max - min || 1;
    const innerW = WIDTH - PAD_LEFT - PAD_RIGHT;
    const innerH = HEIGHT - PAD_TOP - PAD_BOTTOM;
    const step = innerW / candles.length;
    const y = (price: number) => PAD_TOP + (1 - (price - min) / span) * innerH;
    const ticks = [max, min + span * 0.5, min];
    return { min, max, span, innerW, innerH, step, y, ticks };
  }, [candles]);

  const last = candles[candles.length - 1];
  const first = candles[0];
  const up = last.close >= first.open;

  return (
    <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} className="h-[280px] w-full sm:h-[320px]" role="img" aria-label="24 hour candle chart">
      {plot.ticks.map((tick) => (
        <g key={tick}>
          <line
            x1={PAD_LEFT}
            x2={WIDTH - PAD_RIGHT}
            y1={plot.y(tick)}
            y2={plot.y(tick)}
            stroke="currentColor"
            className="text-border"
            strokeWidth="1"
          />
          <text
            x={WIDTH - PAD_RIGHT + 6}
            y={plot.y(tick) + 4}
            className="fill-subtle"
            fontSize="10"
            fontFamily="IBM Plex Mono, ui-monospace, monospace"
          >
            {formatPrice(tick)}
          </text>
        </g>
      ))}

      <line
        x1={PAD_LEFT}
        x2={WIDTH - PAD_RIGHT}
        y1={plot.y(last.close)}
        y2={plot.y(last.close)}
        stroke="currentColor"
        className={up ? "text-up" : "text-down"}
        strokeWidth="1"
        strokeDasharray="4 3"
        opacity="0.7"
      />

      {candles.map((candle, index) => {
        const x = PAD_LEFT + index * plot.step + plot.step / 2;
        const bodyTop = plot.y(Math.max(candle.open, candle.close));
        const bodyBot = plot.y(Math.min(candle.open, candle.close));
        const bodyH = Math.max(1.2, bodyBot - bodyTop);
        const bull = candle.close >= candle.open;
        const color = bull ? "#6aa84f" : "#c45c4a";
        const wickW = Math.max(1, plot.step * 0.12);
        const bodyW = Math.max(2, plot.step * 0.62);
        return (
          <g key={candle.time}>
            <rect x={x - wickW / 2} y={plot.y(candle.high)} width={wickW} height={Math.max(1, plot.y(candle.low) - plot.y(candle.high))} fill={color} />
            <rect x={x - bodyW / 2} y={bodyTop} width={bodyW} height={bodyH} fill={color} />
          </g>
        );
      })}

      {[0, Math.floor(candles.length / 2), candles.length - 1].map((index) => (
        <text
          key={candles[index].time}
          x={PAD_LEFT + index * plot.step + plot.step / 2}
          y={HEIGHT - 6}
          textAnchor="middle"
          className="fill-subtle"
          fontSize="10"
          fontFamily="IBM Plex Mono, ui-monospace, monospace"
        >
          {formatTime(candles[index].time)}
        </text>
      ))}
    </svg>
  );
}

export function LiveChart({ className }: { className?: string }) {
  const [symbol, setSymbol] = useState<(typeof PAIRS)[number]>("BTC");
  const [candles, setCandles] = useState<Candle[]>([]);
  const [status, setStatus] = useState<"loading" | "ready" | "empty">("loading");

  useEffect(() => {
    let active = true;
    const load = async () => {
      setStatus("loading");
      try {
        const response = await fetch(`/api/market-candles?symbol=${symbol}`, { cache: "no-store" });
        if (response.ok) {
          const payload = (await response.json()) as { candles?: Candle[] };
          const rows = payload.candles ?? [];
          if (rows.length >= 8) {
            if (active) {
              setCandles(rows);
              setStatus("ready");
            }
            return;
          }
        }
      } catch {
        // Fall through to a direct Binance public request.
      }

      try {
        const rows = await fetchPairCandles(symbol);
        if (!active) return;
        setCandles(rows);
        setStatus(rows.length >= 8 ? "ready" : "empty");
      } catch {
        if (active) setStatus("empty");
      }
    };

    void load();
    const timer = window.setInterval(load, 180_000);
    return () => {
      active = false;
      window.clearInterval(timer);
    };
  }, [symbol]);

  const last = candles[candles.length - 1];
  const first = candles[0];
  const change = last && first ? ((last.close - first.open) / first.open) * 100 : 0;
  const up = change >= 0;

  return (
    <div className={cn("overflow-hidden rounded-md border border-border bg-surface", className)}>
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-3 py-2">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-subtle">Live chart</p>
          {last ? (
            <p className="mt-1 font-mono text-sm tabular-nums">
              {symbol} ${formatPrice(last.close)}{" "}
              <span className={up ? "text-up" : "text-down"}>
                {up ? "+" : ""}
                {change.toFixed(2)}%
              </span>
              <span className="ml-2 text-[10px] uppercase tracking-wide text-subtle">15m · 24h UTC</span>
            </p>
          ) : (
            <p className="mt-1 text-xs text-muted">Binance spot candles</p>
          )}
        </div>
        <div className="flex gap-1 overflow-x-auto">
          {PAIRS.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setSymbol(item)}
              className={cn(
                "h-8 shrink-0 rounded-sm px-2 font-mono text-[11px]",
                symbol === item ? "bg-primary text-primary-foreground" : "text-muted hover:text-foreground",
              )}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      {status === "ready" ? (
        <CandlePlot candles={candles} />
      ) : (
        <div className="flex h-[280px] items-center justify-center sm:h-[320px]">
          <p className="text-sm text-muted">
            {status === "loading" ? "Loading the chart…" : "Chart data is temporarily unavailable."}
          </p>
        </div>
      )}
    </div>
  );
}
