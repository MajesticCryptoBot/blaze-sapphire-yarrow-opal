import { ExternalLink, Radio } from "lucide-react";
import { useEffect, useState } from "react";
import { ShareBar } from "@/components/share-bar";
import { Sparkline } from "@/components/sparkline";
import { StoryPhotos } from "@/components/story-photos";
import { StoryVideo } from "@/components/story-video";
import { useMarketCharts } from "@/components/use-market-charts";
import { PRICE_REFRESH_MS, fetchBinanceMarkets, type MarketQuote } from "@/lib/binance-markets";
import { formatTime } from "@/lib/news";
import { fitCardPhotos } from "@/lib/photo-fit";
import { storyPath } from "@/lib/story-url";
import { TELEGRAM_CHANNEL, TELEGRAM_URL, splitHeadline, type TelegramPost } from "@/lib/telegram-feed";
import { cn } from "@/lib/utils";

function formatPrice(value: number) {
  if (value >= 1000) return `$${value.toLocaleString("en-US", { maximumFractionDigits: 2 })}`;
  if (value >= 1) return `$${value.toLocaleString("en-US", { maximumFractionDigits: 4 })}`;
  return `$${value.toLocaleString("en-US", { maximumFractionDigits: 6 })}`;
}

export function LiveWire({ latest }: { latest?: TelegramPost }) {
  const [markets, setMarkets] = useState<MarketQuote[]>([]);
  const [marketError, setMarketError] = useState(false);
  const charts = useMarketCharts();

  useEffect(() => {
    let active = true;
    const loadMarkets = async () => {
      try {
        const response = await fetch("/api/market-prices", { cache: "no-store" });
        if (response.ok) {
          const payload = (await response.json()) as { data?: MarketQuote[] };
          const rows = (payload.data ?? []).filter((row) => row.group !== "bstock");
          if (rows.length > 0) {
            if (active) {
              setMarkets(rows);
              setMarketError(false);
            }
            return;
          }
        }
      } catch {
        // Fall through to a direct Binance public request.
      }

      try {
        const rows = (await fetchBinanceMarkets()).filter((row) => row.group !== "bstock");
        if (active) {
          setMarkets(rows);
          setMarketError(rows.length === 0);
        }
      } catch {
        if (active) setMarketError(true);
      }
    };

    void loadMarkets();
    const timer = window.setInterval(loadMarkets, PRICE_REFRESH_MS);
    return () => {
      active = false;
      window.clearInterval(timer);
    };
  }, []);

  const headline = latest ? splitHeadline(latest.text).headline : null;
  const dek = latest ? splitHeadline(latest.text).dek : null;
  // Same "check size, fit, or drop" gate as the deck: the featured wire slot
  // only shows the photo when it fits the uniform 16:9 frame; otherwise the
  // photo lives in the full story view. A fitting photo always renders before
  // any video — a video attachment can never replace a good photo on the wire.
  // Videos show here only for stories that have no card-worthy photo.
  const fit = latest
    ? fitCardPhotos({
        hasPhoto: latest.hasPhoto,
        hasPhoto2: latest.hasPhoto2,
        photoW: latest.photoW,
        photoH: latest.photoH,
        photo2W: latest.photo2W,
        photo2H: latest.photo2H,
      })
    : { mode: "none" as const, solo: 1 as const };

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
            {latest.hasPhoto && fit.mode !== "none" ? (
              <div className="mb-4">
                <StoryPhotos
                  id={latest.id}
                  hasPhoto={latest.hasPhoto}
                  hasPhoto2={latest.hasPhoto2}
                  variant="deck"
                  eager
                  photoW={latest.photoW}
                  photoH={latest.photoH}
                  photo2W={latest.photo2W}
                  photo2H={latest.photo2H}
                  mode={fit.mode === "pair" ? "pair" : "single"}
                  solo={fit.solo}
                />
              </div>
            ) : latest.hasVideo ? (
              <div className="mb-4">
                <StoryVideo id={latest.id} mimeType={latest.videoMimeType} videoUrl={latest.videoUrl} size="wire" />
              </div>
            ) : null}

            <h2 className="font-display text-2xl font-medium leading-snug text-foreground sm:text-3xl">
              {headline}
            </h2>

            {dek ? (
              <p className="mt-3 line-clamp-5 font-news text-base leading-[1.6] text-muted">{dek}</p>
            ) : null}

            <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-2 font-mono text-[10px] uppercase tracking-wide text-subtle">
              <span>{formatTime(latest.publishedAt)} UTC</span>
              <a
                href={latest.messageUrl || TELEGRAM_URL}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-primary transition-colors hover:text-azure"
              >
                Telegram <ExternalLink className="size-3" />
              </a>
            </div>
            <div className="mt-2">
              <ShareBar title={headline ?? "ASP News"} path={storyPath(latest.id)} />
            </div>
          </article>
        )}
      </div>

      <a
        href="/markets"
        className="block rounded-lg border border-border bg-surface p-5 transition-colors hover:border-primary/40 sm:p-6"
      >
        <div className="flex items-center justify-between border-b border-border pb-4">
          <div>
            <h2 className="font-display text-2xl">Spot tape</h2>
            <p className="mt-1 text-xs text-muted">USD · Binance · 5s</p>
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
              <div key={market.symbol} className="flex items-center justify-between gap-3 py-2.5">
                <div className="min-w-0">
                  <div className="font-mono text-sm font-semibold">{market.symbol}</div>
                  <div className="text-xs text-muted">{market.name}</div>
                </div>
                <Sparkline values={charts[market.symbol] ?? []} width={88} height={32} />
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
      </a>
    </section>
  );
}
