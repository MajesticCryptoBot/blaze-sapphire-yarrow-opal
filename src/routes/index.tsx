// src/routes/index.tsx
import { createFileRoute } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { useMemo, useState, useEffect } from "react";
import { ArticleCard } from "@/components/article-card";
import { Input } from "@/components/ui/input";
import { LiveWire, getArchivedTelegramPosts } from "@/components/live-wire";
import { CATEGORIES } from "@/lib/news";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<(typeof CATEGORIES)[number]>("All");
  const [, setForceUpdate] = useState(0);

  // Force re-render every 15 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setForceUpdate(prev => prev + 1);
    }, 15000);
    return () => clearInterval(timer);
  }, []);

  // Get ALL archived posts (up to 12)
  const allArticles = useMemo(() => {
    const archivedPosts = getArchivedTelegramPosts();
    
    return archivedPosts.map((post) => {
      const lines = post.text.split('\n');
      const headline = lines[0] || post.text.slice(0, 100);
      const dek = lines.slice(1).join('\n') || post.text;
      
      let category = "Crypto";
      if (post.text.toLowerCase().includes('ai') || post.text.toLowerCase().includes('nvidia')) {
        category = "AI";
      } else if (post.text.toLowerCase().includes('stock') || post.text.toLowerCase().includes('market')) {
        category = "Markets";
      } else if (post.text.toLowerCase().includes('macro') || post.text.toLowerCase().includes('fed')) {
        category = "Macro";
      }
      
      return {
        slug: `telegram-${post.id}`,
        tag: "NEW" as const,
        headline: headline,
        dek: dek,
        body: [post.text],
        tickers: [],
        category: category,
        publishedAt: post.publishedAt,
        related: [],
        keyFacts: [],
        _telegramId: post.id,
        _hasPhoto: post.hasPhoto,
        _messageUrl: post.messageUrl,
      };
    });
  }, []);

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    return allArticles.filter((a) => {
      const inCat = cat === "All" || a.category === cat;
      if (!inCat) return false;
      if (!query) return true;
      return (
        a.headline.toLowerCase().includes(query) ||
        a.dek.toLowerCase().includes(query) ||
        a.category.toLowerCase().includes(query)
      );
    });
  }, [q, cat, allArticles]);

  // Show ALL posts, not just 3
  const [lead, ...rest] = filtered;

  return (
    <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
      {/* Header - UNCHANGED */}
      <section className="border-b border-border pb-8">
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-subtle">
          The wire · Telegram desk companion
        </p>
        <h1 className="mt-3 max-w-3xl font-display text-4xl font-medium sm:text-5xl">
          The brief behind the headline.
        </h1>
        <p className="mt-4 max-w-2xl text-base text-muted">
          Short Telegram captions stay on the wire. Open any story here for the
          full desk note, key facts, and a shareable link you can append to the
          forwarded message.
        </p>
      </section>

      <LiveWire />

      {/* Search and filters - UNCHANGED */}
      <div className="mt-10 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="relative w-full max-w-md">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-subtle" />
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search tickers, names, themes"
            className="pl-10"
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
                "h-11 shrink-0 rounded-sm border px-3 text-xs font-medium",
                cat === c
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border text-muted hover:text-foreground",
              )}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Show ALL posts in a grid */}
      {lead ? (
        <div className="mt-8 grid gap-4 lg:grid-cols-5">
          <div className="lg:col-span-3">
            <ArticleCard article={lead} featured />
          </div>
          <aside className="flex flex-col gap-4 lg:col-span-2">
            {rest.slice(0, 2).map((a) => (
              <ArticleCard key={a.slug} article={a} />
            ))}
          </aside>
        </div>
      ) : (
        <p className="mt-12 text-sm text-muted">No stories match that filter.</p>
      )}

      {/* Show MORE posts in a second row */}
      {rest.length > 2 && (
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {rest.slice(2).map((a) => (
            <ArticleCard key={a.slug} article={a} />
          ))}
        </div>
      )}

      {/* "For the Telegram desk" section - UNCHANGED */}
      <section id="desk" className="mt-16 rounded-lg border border-border bg-surface p-6 sm:p-8">
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-subtle">
          For the Telegram desk
        </p>
        <h2 className="mt-2 font-display text-2xl">How the link works</h2>
        <ol className="mt-4 max-w-2xl space-y-3 text-sm leading-relaxed text-muted">
          <li>1. Open the story on this site after the rewrite is forwarded.</li>
          <li>2. Use Copy article link on the story page.</li>
          <li>
            3. Append that URL to the Telegram caption so readers can open the
            full brief without leaving the channel thread.
          </li>
        </ol>
        <p className="mt-4 font-mono text-xs text-subtle">
          Example path · /n/telegram-12345
        </p>
      </section>
    </main>
  );
}
