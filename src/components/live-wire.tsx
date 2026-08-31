import { ExternalLink, Radio } from "lucide-react";
import { useEffect, useState } from "react";

type TelegramPost = {
  id: number;
  text: string;
  publishedAt: string;
  hasPhoto: boolean;
  messageUrl: string | null;
};

type Market = {
  symbol: string;
  name: string;
  price: number;
  change24h: number;
  lastUpdated: string | null;
};

function formatTime(value: string) {
  return new Intl.DateTimeFormat(undefined, {
    hour: "2-digit",
    minute: "2-digit",
    day: "2-digit",
    month: "short",
  }).format(new Date(value));
}

function formatPrice(value: number) {
  if (value >= 1000) return `$${value.toLocaleString(undefined, { maximumFractionDigits: 2 })}`;
  if (value >= 1) return `$${value.toLocaleString(undefined, { maximumFractionDigits: 4 })}`;
  return `$${value.toLocaleString(undefined, { maximumFractionDigits: 6 })}`;
}

export function LiveWire() {
  const [posts, setPosts] = useState<TelegramPost[]>([]);
  const [markets, setMarkets] = useState<Market[]>([]);
  const [newsError, setNewsError] = useState(false);
  const [marketError, setMarketError] = useState(false);

  useEffect(() => {
    let active = true;
    const loadNews = async () => {
      try {
        const response = await fetch("/api/news", { cache: "no-store" });
        if (!response.ok) throw new Error("news request failed");
        const payload = (await response.json()) as { posts?: TelegramPost[] };
        if (active) {
          setPosts(payload.posts ?? []);
          setNewsError(false);
        }
      } catch {
        if (active) setNewsError(true);
      }
    };

    void loadNews();
    const timer = window.setInterval(loadNews, 15_000);
    return () => {
      active = false;
      window.clearInterval(timer);
    };
  }, []);

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

  const latestPost = posts[0];
  const previousPosts = posts.slice(1, 7);

  return (
    <section className="mt-10 grid gap-5 lg:grid-cols-[1.5fr_1fr]">
      <div className="rounded-lg border border-border bg-surface p-5 sm:p-6">
        <div className="flex items-center justify-between gap-3 border-b border-border pb-4">
          <div>
            <div className="flex items-center gap-2">
              <Radio className="size-4 text-primary" />
              <h2 className="font-display text-2xl">Live Telegram wire</h2>
            </div>
            <p className="mt-1 text-xs text-muted">Latest post · @AlphaSignalsPro</p>
          </div>
          <span className="font-mono text-[10px] uppercase tracking-wider text-subtle">15s refresh</span>
        </div>

        {newsError ? (
          <p className="py-6 text-sm text-muted">Live wire is temporarily unavailable.</p>
        ) : !latestPost ? (
          <p className="py-6 text-sm text-muted">Waiting for the latest Telegram post.</p>
        ) : (
          <article className="py-5">
            {latestPost.hasPhoto ? (
              <div className="mb-4 flex max-h-[420px] w-full items-center justify-center overflow-hidden rounded-md bg-background">
                <img
                  src={`/api/telegram-photo?id=${latestPost.id}`}
                  alt=""
                  loading="eager"
                  className="max-h-[420px] w-full object-contain"
                />
              </div>
            ) : null}
            <p className="whitespace-pre-wrap text-sm leading-6 text-foreground">{latestPost.text}</p>
            <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-2 font-mono text-[10px] uppercase tracking-wide text-subtle">
              <span>{formatTime(latestPost.publishedAt)}</span>
              {latestPost.messageUrl ? (
                <a
                  href={latestPost.messageUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-primary hover:underline"
                >
                  Telegram <ExternalLink className="size-3" />
                </a>
              ) : null}
            </div>
          </article>
        )}

        {previousPosts.length > 0 ? (
          <div className="border-t border-border pt-5">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-xl">Latest on the wire</h3>
              <span className="font-mono text-[10px] uppercase tracking-wider text-subtle">Recent</span>
            </div>
            <div className="mt-3 divide-y divide-border">
              {previousPosts.map((post) => (
                <article key={post.id} className="py-4 first:pt-1 last:pb-1">
                  <div className="flex items-start justify-between gap-4">
                    <p className="line-clamp-3 whitespace-pre-wrap text-sm leading-6 text-foreground">{post.text}</p>
                    <span className="shrink-0 font-mono text-[10px] uppercase text-subtle">
                      {formatTime(post.publishedAt)}
                    </span>
                  </div>
                  {post.messageUrl ? (
                    <a
                      href={post.messageUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-2 inline-flex items-center gap-1 font-mono text-[10px] uppercase tracking-wide text-primary hover:underline"
                    >
                      Telegram <ExternalLink className="size-3" />
                    </a>
                  ) : null}
                </article>
              ))}
            </div>
          </div>
        ) : null}
      </div>

      <div className="rounded-lg border border-border bg-surface p-5 sm:p-6">
        <div className="flex items-center justify-between border-b border-border pb-4">
          <div>
            <h2 className="font-display text-2xl">Live crypto</h2>
            <p className="mt-1 text-xs text-muted">CoinMarketCap · USD</p>
          </div>
          <span className="font-mono text-[10px] uppercase tracking-wider text-subtle">3m refresh</span>
        </div>

        {marketError && markets.length === 0 ? (
          <p className="py-6 text-sm text-muted">Market data is temporarily unavailable.</p>
        ) : (
          <div className="divide-y divide-border">
            {markets.map((market) => (
              <div key={market.symbol} className="flex items-center justify-between gap-3 py-4">
                <div>
                  <div className="font-mono text-sm font-semibold">{market.symbol}</div>
                  <div className="text-xs text-muted">{market.name}</div>
                </div>
                <div className="text-right">
                  <div className="font-mono text-sm">{formatPrice(market.price)}</div>
                  <div className={market.change24h >= 0 ? "font-mono text-xs text-primary" : "font-mono text-xs text-destructive"}>
                    {market.change24h >= 0 ? "+" : ""}{market.change24h.toFixed(2)}%
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
