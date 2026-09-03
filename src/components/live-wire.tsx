import { ExternalLink, Radio } from "lucide-react";
import { useEffect, useState } from "react";
import { StoryPhotos } from "@/components/story-photos";
import { StoryVideo } from "@/components/story-video";
import { formatTime } from "@/lib/news";
import { TELEGRAM_CHANNEL, TELEGRAM_URL, splitHeadline, type TelegramPost } from "@/lib/telegram-feed";
import { cn } from "@/lib/utils";

type Market = {
  symbol: string;
  name: string;
  price: number;
  change24h: number;
};

function formatPrice(value: number) {
  if (value >= 1000) return `$${value.toLocaleString("en-US", { maximumFractionDigits: 2 })}`;
  if (value >= 1) return `$${value.toLocaleString("en-US", { maximumFractionDigits: 4 })}`;
  return `$${value.toLocaleString("en-US", { maximumFractionDigits: 6 })}`;
}

export function LiveWire({ latest }: { latest?: TelegramPost }) {
  const [markets, setMarkets] = useState<Market[]>([]);
  const [marketError, setMarketError] = useState(false);

  useEffect(() => {
    let active = true;
    const loadMarkets = async () => {
      try {
        const response = await fetch("/api/market-prices", { cache: "no-store" });
        if (!response.ok) throw new Error("market request failed");
        const payload = (await response.json()) as { data?: Market[] };
        if (active) {
          setMarkets(payload.data ?? []);
          setMarketError(false);
        }
      } catch {
        if (active) setMarketError(true);
      }
    };

    void loadMarkets();
    const timer = window.setInterval(loadMarkets, 180_000);
    return () => {
      active = false;
      window.clearInterval(timer);
    };
  }, []);

  const headline = latest ? splitHeadline(latest.text).headline : null;
  const dek = latest ? splitHeadline(latest.text).dek : null;

  return (
    <section className="mt-10 grid gap-5 lg:grid-cols-[1.5fr_1fr]">
      <div className="rounded-lg border border-border bg-surface p-5 sm:p-6">
        <div className="flex items-center justify-between gap-3 border-b border-border pb-4">
          <div>
            <div className="flex items-center gap-2">
              <Radio className="size-4 text-signal" />
              <h2 className="font-display text-2xl">On the wire</h2>
            </div>
            <p className="mt-1 text-xs text-muted">Latest from @{TELEGRAM_CHANNEL}</p>
          </div>
          <span className="font-mono text-[10px] uppercase tracking-wider text-subtle">Live</span>
        </div>

        {!latest ? (
          <p className="py-6 text-sm text-muted">Waiting for the next headline.</p>
        ) : (
          <article className="py-5">
            {latest.hasVideo ? (
              <div className="mb-4">
                <StoryVideo id={latest.id} mimeType={latest.videoMimeType} />
              </div>
            ) : latest.hasPhoto ? (
              <div className="mb-4">
                <StoryPhotos
                  id={latest.id}
                  hasPhoto={latest.hasPhoto}
                  hasPhoto2={latest.hasPhoto2}
                  size="wire"
                />
              </div>
            ) : null}

            <h2 className="font-display text-2xl font-medium leading-snug text-foreground sm:text-3xl">
              {headline}
            </h2>

            {dek ? (
              <p className="mt-3 line-clamp-5 text-base leading-relaxed text-muted">{dek}</p>
            ) : null}

            <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-2 font-mono text-[10px] uppercase tracking-wide text-subtle">
              <span>{formatTime(latest.publishedAt)} UTC</span>
              <a
                href={latest.messageUrl || TELEGRAM_URL}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-primary hover:underline"
              >
                Telegram <ExternalLink className="size-3" />
              </a>
            </div>
          </article>
        )}
      </div>

      <div className="rounded-lg border border-border bg-surface p-5 sm:p-6">
        <div className="flex items-center justify-between border-b border-border pb-4">
          <div>
            <h2 className="font-display text-2xl">Spot tape</h2>
            <p className="mt-1 text-xs text-muted">USD · session quotes</p>
          </div>
          <span className="font-mono text-[10px] uppercase tracking-wider text-subtle">Live</span>
        </div>

        {marketError && markets.length === 0 ? (
          <p className="py-6 text-sm text-muted">Market data is temporarily unavailable.</p>
        ) : markets.length === 0 ? (
          <p className="py-6 text-sm text-muted">Loading the tape…</p>
        ) : (
          <div className="divide-y divide-border">
            {markets.map((market) => (
              <div key={market.symbol} className="flex items-center justify-between gap-3 py-4">
                <div>
                  <div className="font-mono text-sm font-semibold">{market.symbol}</div>
                  <div className="text-xs text-muted">{market.name}</div>
                </div>
                <div className="text-right">
                  <div className="font-mono text-sm tabular-nums">{formatPrice(market.price)}</div>
                  <div
                    className={cn(
                      "font-mono text-xs tabular-nums",
                      market.change24h >= 0 ? "text-up" : "text-down",
                    )}
                  >
                    {market.change24h >= 0 ? "+" : ""}
                    {market.change24h.toFixed(2)}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
