import { createFileRoute, Link } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { ArticleCard } from "@/components/article-card";
import { LiveChart } from "@/components/live-chart";
import { LiveWire } from "@/components/live-wire";
import { WatchListBar } from "@/components/watch-list-bar";
import { Input } from "@/components/ui/input";
import { CATEGORIES, type Article } from "@/lib/news";
import { filterAndRankArticles } from "@/lib/search";
import { TELEGRAM_URL, categoryFromText, splitHeadline, tagFromText, type TelegramPost } from "@/lib/telegram-feed";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({
  validateSearch: (search: Record<string, unknown>) => ({
    q: typeof search.q === "string" ? search.q : "",
  }),
  component: Home,
});

function toArticle(post: TelegramPost): Article & {
  _telegramId: number;
  _hasPhoto: boolean;
  _hasPhoto2: boolean;
  _hasVideo: boolean;
  _videoMimeType: string | null;
  _videoUrl: string | null;
  _messageUrl: string | null;
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
    _messageUrl: post.messageUrl,
  };
}

function Home() {
  const { q: searchQuery } = Route.useSearch();
  const [q, setQ] = useState(searchQuery);
  const [cat, setCat] = useState<(typeof CATEGORIES)[number]>("All");
  const [posts, setPosts] = useState<TelegramPost[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setQ(searchQuery);
  }, [searchQuery]);

  useEffect(() => {
    let active = true;
    const load = async () => {
      try {
        const response = await fetch("/api/news");
        if (!response.ok) throw new Error("news request failed");
        const payload = (await response.json()) as { posts?: TelegramPost[] };
        if (active) setPosts(payload.posts ?? []);
      } catch {
        if (active) setPosts([]);
      } finally {
        if (active) setLoaded(true);
      }
    };
    void load();
    const timer = window.setInterval(load, 30_000);
    return () => {
      active = false;
      window.clearInterval(timer);
    };
  }, []);

  const allArticles = useMemo(() => posts.map(toArticle), [posts]);

  const filtered = useMemo(() => {
    const inCategory =
      cat === "All" ? allArticles : allArticles.filter((a) => a.category === cat);
    return filterAndRankArticles(inCategory, q).slice(0, 10);
  }, [q, cat, allArticles]);

  const [lead, ...rest] = filtered.slice(0, 10);

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
      <section className="border-b border-border/70 pb-10 sm:pb-12">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-subtle">Live market intelligence</p>
        <h1 className="mt-4 max-w-3xl text-4xl font-semibold tracking-[-0.035em] sm:text-6xl">The brief behind the headline.</h1>
        <p className="mt-5 max-w-2xl text-base leading-7 text-muted sm:text-lg">Alpha Signals Pro covers crypto, macro, and AI as it hits the tape. Headlines move first on Telegram. This desk holds the full brief.</p>
      </section>

      <WatchListBar />
      <LiveWire latest={posts[0]} />
      <LiveChart className="mt-6" />

      <div id="feed" className="mt-12 flex scroll-mt-24 flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="relative w-full max-w-md">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-subtle" />
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search the wire"
            className="h-11 rounded-xl pl-10"
            aria-label="Search the wire"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setCat(c)}
              className={cn(
                "h-11 shrink-0 rounded-full border px-4 text-xs font-semibold transition-[background-color,border-color,color] duration-[var(--motion-quick)]",
                cat === c
                  ? "border-azure bg-azure text-white"
                  : "border-border text-muted hover:border-azure hover:bg-azure/10 hover:text-azure",
              )}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {lead ? (
        <div className="mt-8 grid gap-5 lg:grid-cols-5">
          <div className="lg:col-span-3">
            <ArticleCard article={lead} featured />
          </div>
          <aside className="flex flex-col gap-5 lg:col-span-2">
            {rest.slice(0, 2).map((a) => (
              <ArticleCard key={a.slug} article={a} />
            ))}
          </aside>
        </div>
      ) : (
        <p className="mt-12 text-sm text-muted">
          {loaded ? "No stories match that filter." : "Loading the wire…"}
        </p>
      )}

      {rest.length > 2 ? (
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {rest.slice(2).map((a) => (
            <ArticleCard key={a.slug} article={a} />
          ))}
        </div>
      ) : null}

      <section id="about" className="mt-20 rounded-2xl bg-surface p-7 shadow-[var(--shadow-border)] sm:p-9">
        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-subtle">The desk</p>
        <h2 className="mt-3 text-2xl font-semibold tracking-[-0.02em]">Built for the open tape</h2>
        <p className="mt-4 max-w-2xl text-sm leading-6 text-muted">
          Every story on this site is the same copy that hits the Alpha Signals Pro channel — expanded so you can read,
          share, and keep a permanent link. Nothing here is a trade recommendation.
        </p>
        <div className="mt-7 flex flex-wrap gap-3">
          <a
            href={TELEGRAM_URL}
            target="_blank"
            rel="noreferrer"
            className="inline-flex h-11 items-center rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground transition-[transform,opacity] duration-[var(--motion-quick)] hover:opacity-90 active:scale-[0.98]"
          >
            Open Telegram
          </a>
          <Link
            to="/markets"
            className="inline-flex h-11 items-center rounded-full border border-border px-5 text-sm font-medium text-muted transition-[background-color,border-color,color] duration-[var(--motion-quick)] hover:border-azure hover:bg-azure/10 hover:text-azure"
          >
            View markets
          </Link>
        </div>
      </section>
    </main>
  );
}
