import { Link } from "@tanstack/react-router";
import { ArrowLeft, Camera, Clapperboard, Newspaper } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { ArticleCard } from "@/components/article-card";
import type { DeskSection } from "@/lib/desk-sections";
import { formatTime, type Article } from "@/lib/news";
import { categoryFromText, splitHeadline, tagFromText, type TelegramPost } from "@/lib/telegram-feed";

function toArticle(post: TelegramPost): Article & { _telegramId: number } {
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
  };
}

function matchesDesk(post: TelegramPost, section: DeskSection) {
  if (section.slug === "news" || section.wireTerms.length === 0) return true;
  const haystack = post.text.toLowerCase();
  return section.wireTerms.some((term) => haystack.includes(term));
}

function EmptyWell({
  icon: Icon,
  label,
  hint,
}: {
  icon: typeof Newspaper;
  label: string;
  hint: string;
}) {
  return (
    <div className="flex min-h-40 flex-col justify-between rounded-lg border border-dashed border-border bg-surface p-5">
      <div className="flex items-center gap-2 text-muted">
        <Icon className="size-4" strokeWidth={1.7} />
        <p className="font-mono text-[10px] uppercase tracking-[0.16em]">{label}</p>
      </div>
      <p className="font-news text-sm leading-[1.6] text-subtle">{hint}</p>
    </div>
  );
}

export function DeskPage({ section }: { section: DeskSection }) {
  const [posts, setPosts] = useState<TelegramPost[]>([]);

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

  const related = useMemo(
    () => posts.filter((post) => matchesDesk(post, section)).slice(0, 6).map(toArticle),
    [posts, section],
  );

  return (
    <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
      <Link
        to="/"
        search={{ q: "" }}
        className="inline-flex h-11 items-center gap-2 text-sm text-muted hover:text-foreground"
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

      {section.paragraphs.length > 0 ? (
        <section className="mt-8 max-w-3xl space-y-5">
          {section.paragraphs.map((paragraph) => (
            <p key={paragraph} className="font-news text-[18px] leading-[1.6] text-foreground/92">
              {paragraph}
            </p>
          ))}
        </section>
      ) : null}

      <section className="mt-10 grid gap-4 lg:grid-cols-3">
        {section.stories.length > 0 ? (
          <div className="space-y-3 lg:col-span-1">
            <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-subtle">Stories</p>
            {section.stories.map((story) => (
              <article key={story.title} className="rounded-lg border border-border bg-surface p-5">
                <h2 className="font-display text-xl">{story.title}</h2>
                <p className="mt-2 font-news text-[15px] leading-[1.6] text-muted">{story.dek}</p>
                {story.href ? (
                  <a href={story.href} className="mt-3 inline-block text-sm text-primary hover:underline">
                    Read
                  </a>
                ) : null}
              </article>
            ))}
          </div>
        ) : (
          <EmptyWell icon={Newspaper} label="Stories" hint="Longer briefs for this desk will appear here." />
        )}

        {section.photos.length > 0 ? (
          <div className="space-y-3">
            <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-subtle">Photos</p>
            {section.photos.map((photo) => (
              <figure key={photo.src} className="overflow-hidden rounded-lg border border-border bg-surface">
                <img src={photo.src} alt={photo.caption} className="aspect-[16/10] w-full object-cover" />
                <figcaption className="px-4 py-3 font-news text-sm text-muted">{photo.caption}</figcaption>
              </figure>
            ))}
          </div>
        ) : (
          <EmptyWell icon={Camera} label="Photos" hint="Still photography assigned to this desk will appear here." />
        )}

        {section.videos.length > 0 ? (
          <div className="space-y-3">
            <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-subtle">Videos</p>
            {section.videos.map((video) => (
              <figure key={video.src} className="overflow-hidden rounded-lg border border-border bg-surface">
                <video src={video.src} controls playsInline className="aspect-video w-full bg-black" />
                <figcaption className="px-4 py-3 font-news text-sm text-muted">{video.caption}</figcaption>
              </figure>
            ))}
          </div>
        ) : (
          <EmptyWell icon={Clapperboard} label="Videos" hint="Video packages for this desk will appear here." />
        )}
      </section>

      {related.length > 0 ? (
        <section className="mt-12">
          <div className="mb-4 flex items-end justify-between gap-3">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-subtle">From the tape</p>
              <h2 className="mt-1 font-display text-2xl">Related headlines</h2>
            </div>
            <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-subtle">
              {formatTime(related[0].publishedAt)}
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((article) => (
              <ArticleCard key={article.slug} article={article} />
            ))}
          </div>
        </section>
      ) : null}
    </main>
  );
}
