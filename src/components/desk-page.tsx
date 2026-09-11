import { Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { ArticleCard } from "@/components/article-card";
import { CRYPTO_FACTS } from "@/lib/crypto-facts";
import { matchesDesk, type DeskSection } from "@/lib/desk-sections";
import { type Article } from "@/lib/news";
import { categoryFromText, splitHeadline, tagFromText, type TelegramPost } from "@/lib/telegram-feed";

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

export function DeskPage({ section }: { section: DeskSection }) {
  const [posts, setPosts] = useState<TelegramPost[] | null>(null);

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

      {section.slug === "fun-facts" ? (
        <section className="mt-8">
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-subtle">
            Sourced notebook
          </p>
          <p className="mt-2 max-w-2xl font-news text-sm leading-relaxed text-muted">
            These notes are taken from primary Bitcoin literature — the white paper,
            the Nakamoto Institute archive, Cambridge’s CBECI, and the SEC — not from
            recap blogs.
          </p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {CRYPTO_FACTS.map((fact) => (
              <article key={fact.title} className="rounded-lg border border-border bg-surface p-5">
                <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-subtle">{fact.year}</p>
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

      {posts === null ? (
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
