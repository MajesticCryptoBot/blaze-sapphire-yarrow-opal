import { Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { ArticleCard } from "@/components/article-card";
import { getWeeklyFacts } from "@/lib/crypto-facts";
import { matchesDesk, type DeskSection } from "@/lib/desk-sections";
import { PRICE_REFRESH_MS, fetchBinanceMarkets, type MarketQuote } from "@/lib/binance-markets";
import { type Article } from "@/lib/news";
import { categoryFromText, splitHeadline, tagFromText, type TelegramPost } from "@/lib/telegram-feed";
import { cn } from "@/lib/utils";

function toArticle(post: TelegramPost): Article & {
  _telegramId: number;
  _hasPhoto: boolean;
  _hasPhoto2: boolean;
  _hasVideo: boolean;
  _videoMimeType: string | null;
  _videoUrl: string | null;
} {
  const { headline, dek } = splitHeadline(post.text);
  return {
    slug: `telegram-${post.id}`,
    tag: tagFromText(post.text),
    headline,
    dek: dek || headline,
    body: dek ? [dek] : [headline],
    tickers: [],
    category: categoryFromText(post.text),
    publishedAt: post.publishedAt,
    related: [],
    keyFacts: [],
    _telegramId: post.id,
    _hasPhoto: post.hasPhoto,
    _hasPhoto2: post.hasPhoto2,
    _hasVideo: post.hasVideo,
    _videoMimeType: post.videoMimeType,
    _videoUrl: post.videoUrl,
  };
}

function formatPrice(value: number) {
  if (value >= 1000) return value.toLocaleString("en-US", { maximumFractionDigits: 2 });
  if (value >= 1) return value.toLocaleString("en-US", { maximumFractionDigits: 4 });
  return value.toLocaleString("en-US", { maximumFractionDigits: 6 });
}

function MoversTable({
  rows,
  emptyLabel,
  loading,
}: {
  rows: MarketQuote[];
  emptyLabel: string;
  loading: boolean;
}) {
  return (
    <div className="overflow-x-auto rounded-lg border border-border">
      <table className="w-full min-w-[560px] text-left">
        <thead className="bg-surface font-mono text-[11px] uppercase tracking-[0.12em] text-subtle">
          <tr>
            <th className="px-4 py-3 font-medium">#</th>
            <th className="px-4 py-3 font-medium">Symbol</th>
            <th className="px-4 py-3 font-medium">Name</th>
            <th className="px-4 py-3 font-medium">Last</th>
            <th className="px-4 py-3 font-medium">24h</th>
            <th className="px-4 py-3 font-medium">Group</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((market, index) => {
            const up = market.change24h >= 0;
            return (
              <tr key={market.symbol} className="border-t border-border">
                <td className="px-4 py-3 font-mono text-sm text-subtle">{index + 1}</td>
                <td className="px-4 py-3 font-mono text-sm font-semibold">{market.symbol}</td>
                <td className="px-4 py-3 text-sm text-muted">{market.name}</td>
                <td className="px-4 py-3 font-mono text-sm tabular-nums">${formatPrice(market.price)}</td>
                <td className={cn("px-4 py-3 font-mono text-sm tabular-nums", up ? "text-up" : "text-down")}>
                  {up ? "+" : ""}{market.change24h.toFixed(2)}%
                </td>
                <td className="px-4 py-3 font-mono text-[11px] uppercase tracking-wide text-subtle">
                  {market.group === "bstock" ? "bStock" : "CEX"}
                </td>
              </tr>
            );
          })}
          {loading && rows.length === 0
            ? Array.from({ length: 3 }).map((_, i) => (
                <tr key={i} className="border-t border-border">
                  <td className="px-4 py-3 text-sm text-subtle" colSpan={6}>
                    Loading…
                  </td>
                </tr>
              ))
            : null}
          {!loading && rows.length === 0 ? (
            <tr className="border-t border-border">
              <td className="px-4 py-3 text-sm text-muted" colSpan={6}>
                {emptyLabel}
              </td>
            </tr>
          ) : null}
        </tbody>
      </table>
    </div>
  );
}

function TopMoversPanel() {
  const [markets, setMarkets] = useState<MarketQuote[]>([]);
  const [error, setError] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let active = true;
    const load = async () => {
      try {
        const response = await fetch("/api/market-prices", { cache: "no-store" });
        if (response.ok) {
          const payload = (await response.json()) as { data?: MarketQuote[] };
          const rows = payload.data ?? [];
          if (rows.length > 0) {
            if (active) {
              setMarkets(rows);
              setError(false);
              setLoaded(true);
            }
            return;
          }
        }
      } catch {
        // Fall through to a direct Binance public request.
      }

      try {
        const rows = await fetchBinanceMarkets();
        if (active) {
          setMarkets(rows);
          setError(rows.length === 0);
        }
      } catch {
        if (active) setError(true);
      } finally {
        if (active) setLoaded(true);
      }
    };

    void load();
    const timer = window.setInterval(load, PRICE_REFRESH_MS);
    return () => {
      active = false;
      window.clearInterval(timer);
    };
  }, []);

  const { gainers, losers } = useMemo(() => {
    const pool = markets.filter((m) => m.group === "crypto" || m.group === "bstock");
    const gainers = pool
      .filter((m) => m.change24h > 0)
      .sort((a, b) => b.change24h - a.change24h);
    const losers = pool
      .filter((m) => m.change24h < 0)
      .sort((a, b) => a.change24h - b.change24h);
    return { gainers, losers };
  }, [markets]);

  return (
    <section className="mt-8 space-y-10">
      <div>
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-subtle">
          24-hour tape
        </p>
        <p className="mt-2 max-w-2xl font-news text-sm leading-relaxed text-muted">
          Gainers and losers among major CEX tokens and bStocks, ranked by 24-hour change.
        </p>
      </div>

      <div>
        <h2 className="font-display text-2xl text-up">Gainers</h2>
        <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.14em] text-subtle">
          Highest 24h % gains
        </p>
        <div className="mt-4">
          <MoversTable
            rows={gainers}
            emptyLabel="No gainers on the tape right now."
            loading={!loaded}
          />
        </div>
      </div>

      <div>
        <h2 className="font-display text-2xl text-down">Losers</h2>
        <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.14em] text-subtle">
          Largest 24h % declines
        </p>
        <div className="mt-4">
          <MoversTable
            rows={losers}
            emptyLabel="No losers on the tape right now."
            loading={!loaded}
          />
        </div>
      </div>

      {error && markets.length === 0 && loaded ? (
        <p className="text-sm text-muted">
          Movers are temporarily unavailable. Please try again shortly.
        </p>
      ) : null}
    </section>
  );
}

export function DeskPage({ section }: { section: DeskSection }) {
  const [posts, setPosts] = useState<TelegramPost[] | null>(null);

  useEffect(() => {
    if (section.slug === "top-movers") return;
    let active = true;
    const load = async () => {
      try {
        const response = await fetch("/api/news");
        if (!response.ok) throw new Error("news request failed");
        const payload = (await response.json()) as { posts?: TelegramPost[] };
        if (active) setPosts(payload.posts ?? []);
      } catch {
        if (active) setPosts([]);
      }
    };
    void load();
    return () => {
      active = false;
    };
  }, [section.slug]);

  const items = useMemo(
    () => (posts ?? []).filter((post) => matchesDesk(post, section)).map(toArticle).slice(0, 20),
    [posts, section],
  );
  const [lead, ...rest] = items;

  const weeklyFacts = useMemo(() => getWeeklyFacts(8), []);

  return (
    <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
      <Link
        to="/"
        search={{ q: "" }}
        className="inline-flex h-11 items-center gap-2 text-sm text-muted transition-colors hover:text-azure"
      >
        <ArrowLeft className="size-4" />
        Back
      </Link>

      <header className="mt-6 max-w-3xl border-b border-border pb-8">
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-subtle">
          {section.kicker}
        </p>
        <h1 className="mt-3 font-display text-4xl font-medium sm:text-5xl">{section.headline}</h1>
        <p className="mt-4 font-news text-lg leading-[1.6] text-muted">{section.dek}</p>
      </header>

      {section.slug === "top-movers" ? <TopMoversPanel /> : null}

      {section.slug === "fun-facts" ? (
        <section className="mt-8">
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-subtle">
            This week’s notebook
          </p>
          <p className="mt-2 max-w-2xl font-news text-sm leading-relaxed text-muted">
            For the curious
          </p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {weeklyFacts.map((fact) => (
              <article key={fact.title} className="rounded-lg border border-border bg-surface p-5">
                <div className="flex items-center justify-between gap-2">
                  <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-subtle">{fact.year}</p>
                  {fact.tone === "humor" ? (
                    <span className="rounded-sm border border-border px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-wide text-subtle">
                      Humor
                    </span>
                  ) : null}
                </div>
                <h2 className="mt-2 font-display text-xl font-medium">{fact.title}</h2>
                <p className="mt-3 font-news text-[15px] leading-[1.6] text-muted">{fact.body}</p>
                <a
                  href={fact.href}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-4 inline-flex h-11 items-center text-sm text-azure hover:underline"
                >
                  {fact.source} →
                </a>
              </article>
            ))}
          </div>
        </section>
      ) : null}

      {section.slug === "top-movers" ? null : posts === null ? (
        <p className="mt-10 font-news text-base text-muted">Loading this desk…</p>
      ) : !lead ? (
        section.slug === "fun-facts" ? null : (
          <p className="mt-10 font-news text-base text-muted">No matching briefs on this desk yet.</p>
        )
      ) : (
        <>
          {section.slug === "fun-facts" ? (
            <p className="mt-10 font-mono text-[11px] uppercase tracking-[0.18em] text-subtle">
              From the tape
            </p>
          ) : null}
          <div className={section.slug === "fun-facts" ? "mt-4" : "mt-8"}>
            <ArticleCard article={lead} featured from={section.slug} />
          </div>
          {rest.length > 0 ? (
            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {rest.map((article) => (
                <ArticleCard key={article.slug} article={article} from={section.slug} />
              ))}
            </div>
          ) : null}
        </>
      )}
    </main>
  );
}
