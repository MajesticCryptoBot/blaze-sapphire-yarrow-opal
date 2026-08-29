import { createFileRoute } from "@tanstack/react-router";
import { Area, AreaChart, ResponsiveContainer } from "recharts";
import { TICKERS } from "@/lib/markets";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/markets")({ component: Markets });

function Markets() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
      <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-subtle">
        Session snapshot
      </p>
      <h1 className="mt-3 font-display text-4xl font-medium">Markets</h1>
      <p className="mt-3 max-w-xl text-muted">
        Desk reference tape used alongside the wire. Figures are illustrative
        session marks, not a live brokerage feed.
      </p>

      <div className="mt-8 overflow-x-auto rounded-lg border border-border">
        <table className="w-full min-w-[640px] text-left">
          <thead className="bg-surface font-mono text-[11px] uppercase tracking-[0.12em] text-subtle">
            <tr>
              <th className="px-4 py-3 font-medium">Symbol</th>
              <th className="px-4 py-3 font-medium">Name</th>
              <th className="px-4 py-3 font-medium">Last</th>
              <th className="px-4 py-3 font-medium">Change</th>
              <th className="px-4 py-3 font-medium">Trend</th>
            </tr>
          </thead>
          <tbody>
            {TICKERS.map((t) => {
              const up = t.change >= 0;
              const data = t.spark.map((v, i) => ({ i, v }));
              return (
                <tr key={t.symbol} className="border-t border-border">
                  <td className="px-4 py-4 font-mono text-sm">{t.symbol}</td>
                  <td className="px-4 py-4 text-sm text-muted">{t.name}</td>
                  <td className="px-4 py-4 font-mono text-sm tabular-nums">
                    {t.price.toLocaleString("en-US", { maximumFractionDigits: 2 })}
                  </td>
                  <td
                    className={cn(
                      "px-4 py-4 font-mono text-sm tabular-nums",
                      up ? "text-up" : "text-down",
                    )}
                  >
                    {up ? "+" : ""}
                    {t.change.toFixed(2)}%
                  </td>
                  <td className="px-4 py-4">
                    <div className="h-10 w-28">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={data} margin={{ top: 4, right: 0, left: 0, bottom: 0 }}>
                          <Area
                            type="monotone"
                            dataKey="v"
                            stroke={up ? "#6aa84f" : "#c45c4a"}
                            fill={up ? "rgba(106,168,79,0.16)" : "rgba(196,92,74,0.16)"}
                            strokeWidth={1.5}
                            dot={false}
                            isAnimationActive={false}
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </main>
  );
}
