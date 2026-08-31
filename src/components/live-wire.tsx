import { ExternalLink, Radio } from "lucide-react";
import { useEffect, useState } from "react";

type TelegramPost = {
  id: number;
  text: string;
  publishedAt: string;
  hasPhoto: boolean;
  messageUrl: string | null;
  photoIds?: number[]; // Add support for multiple photos
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

// Store ALL posts permanently (except the latest one)
let globalArchivedPosts: TelegramPost[] = [];
let allSeenIds = new Set<number>();

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
          const allPosts = payload.posts ?? [];
          setPosts(allPosts);
          
          // Get the latest post ID
          const latestId = allPosts.length > 0 ? allPosts[0].id : null;
          
          // Process ALL posts (including the latest one)
          for (const post of allPosts) {
            // Skip if we've already seen this post
            if (allSeenIds.has(post.id)) continue;
            
            // If this is the latest post, don't archive it (it stays in Live Wire)
            if (post.id === latestId) continue;
            
            // Add to archived posts
            allSeenIds.add(post.id);
            globalArchivedPosts = [...globalArchivedPosts, post];
          }
          
          // Sort archived posts by date (newest first)
          globalArchivedPosts.sort(
            (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
          );
          
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
            {/* Show multiple photos if available */}
            {latestPost.hasPhoto && latestPost.photoIds && latestPost.photoIds.length > 0 ? (
              <div className="mb-4 grid gap-2 grid-cols-1">
                {latestPost.photoIds.map((photoId, index) => (
                  <div key={photoId} className="flex max-h-[420px] w-full items-center justify-center overflow-hidden rounded-md bg-background">
                    <img
                      src={`/api/telegram-photo?id=${photoId}`}
                      alt={`Photo ${index + 1}`}
                      loading="eager"
                      className="max-h-[420px] w-full object-contain"
                    />
                  </div>
                ))}
              </div>
            ) : latestPost.hasPhoto ? (
              // Fallback for single photo (old format)
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

// Export function to get ALL archived posts
export function getArchivedTelegramPosts(): TelegramPost[] {
  return globalArchivedPosts;
}
