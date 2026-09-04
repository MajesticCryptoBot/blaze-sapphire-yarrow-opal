import { createFileRoute, Link } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { ArticleCard } from "@/components/article-card";
import { LiveWire } from "@/components/live-wire";
import { Input } from "@/components/ui/input";
import { CATEGORIES, type Article } from "@/lib/news";
import { TELEGRAM_URL, categoryFromText, splitHeadline, tagFromText, type TelegramPost } from "@/lib/telegram-feed";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({
  validateSearch: (search: Record<string, unknown>) => ({
    q: typeof search.q === "string" ? search.q : "",
  }),
  component: Home,
});

function toArticle(post: TelegramPost): Article & { _telegramId: number; _hasPhoto: boolean; _messageUrl: string | null } {
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
    const query = q.trim().toLowerCase();
    return allArticles.filter((a) => {
      const inCat = cat === "All" || a.category === cat;
      if (!inCat) return false;
      if (!query) return true;
      const haystack = [a.headline, a.dek, a.body.join(" "), a.category, a.tag, a.tickers.join(" ")].join(" ").toLowerCase();
      if (query.length <= 3) {
        return new RegExp(`\\b${query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "i").test(haystack);
      }
      return haystack.includes(query);
    });
  }, [q, cat, allArticles]);

  const [lead, ...rest] = filtered;

  return (
    <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
      <section className="border-b border-border pb-8">
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-subtle">Live market intelligence</p>
        <h1 className="mt-3 max-w-3xl font-display text-4xl font-medium sm:text-5xl">The brief behind the headline.</h1>
        <p className="mt-4 max-w-2xl text-base text-muted">Alpha Signals Pro covers crypto, macro, and AI as it hits the tape. Headlines move first on Telegram. This desk holds the full brief.</p>
      </section>

      <LiveWire latest={posts[0]} />

      <div id="feed" className="mt-10 flex scroll-mt-24 flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="relative w-full max-w-md">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-subtle" />
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search the wire" className="pl-10" aria-label="Search the wire" />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1">
          {CATEGORIES.map((c) => (
            <button key={c} type="button" onClick={() => setCat(c)} className={cn("h-11 shrink-0 rounded-sm border px-3 text-xs font-medium", cat === c ? "border-primary bg-primary text-primary-foreground" : "border-border text-muted hover:text-foreground")}>{c}</button>
          ))}
        </div>
      </div>

      {lead ? (
        <div className="mt-8 grid gap-4 lg:grid-cols-5">
          <div className="lg:col-span-3"><ArticleCard article={lead} featured /></div>
          <aside className="flex flex-col gap-4 lg:col-span-2">{rest.slice(0, 2).map((a) => <ArticleCard key={a.slug} article={a} />)}</aside>
        </div>
      ) : <p className="mt-12 text-sm text-muted">{loaded ? "No stories match that filter." : "Loading the wire…"}</p>}

      {rest.length > 2 ? <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{rest.slice(2).map((a) => <ArticleCard key={a.slug} article={a} />)}</div> : null}

      <section id="about" className="mt-16 rounded-lg border border-border bg-surface p-6 sm:p-8">
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-subtle">The desk</p>
        <h2 className="mt-2 font-display text-2xl">Built for the open tape</h2>
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted">Every story on this site is the same copy that hits the Alpha Signals Pro channel — expanded so you can read, share, and keep a permanent link. Nothing here is a trade recommendation.</p>
        <div className="mt-6 flex flex-wrap gap-3">
          <a href={TELEGRAM_URL} target="_blank" rel="noreferrer" className="inline-flex h-11 items-center rounded-sm bg-primary px-4 text-sm font-medium text-primary-foreground">Open Telegram</a>
          <Link to="/markets" className="inline-flex h-11 items-center rounded-sm border border-border px-4 text-sm text-muted hover:text-foreground">View markets</Link>
        </div>
      </section>
    </main>
  );
}
