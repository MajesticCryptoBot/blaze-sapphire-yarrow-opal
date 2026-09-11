import { Link } from "@tanstack/react-router";
import { ShareBar } from "@/components/share-bar";
import { StoryPhotos } from "@/components/story-photos";
import { StoryVideo } from "@/components/story-video";
import { TagBadge } from "@/components/tag-badge";
import { formatTime, type Article } from "@/lib/news";
import { storyPath } from "@/lib/story-url";

type ArticleWithTelegram = Article & {
  _telegramId?: number;
  _hasPhoto?: boolean;
  _hasPhoto2?: boolean;
  _hasVideo?: boolean;
  _videoMimeType?: string | null;
  _messageUrl?: string | null;
};

export function ArticleCard({
  article,
  featured = false,
  from = "",
}: {
  article: ArticleWithTelegram;
  featured?: boolean;
  from?: string;
}) {
  const slug = article._telegramId ? `telegram-${article._telegramId}` : article.slug;
  const path = storyPath(article._telegramId ?? slug);
  const hasVideo = Boolean(article._telegramId && article._hasVideo);
  const hasPhotos = Boolean(featured && article._telegramId && article._hasPhoto);
  const hasMedia = hasVideo || hasPhotos;

  return (
    <article className="rounded-lg border border-border bg-surface transition-[border-color] duration-[var(--motion-fast)] ease-[var(--ease-out)] hover:border-ring/40">
      {hasMedia && article._telegramId ? (
        <div className="px-5 pt-5">
          {hasVideo ? (
            <StoryVideo
              id={article._telegramId}
              mimeType={article._videoMimeType}
              size={featured ? "article" : "card"}
            />
          ) : (
            <StoryPhotos
              id={article._telegramId}
              hasPhoto={Boolean(article._hasPhoto)}
              hasPhoto2={Boolean(article._hasPhoto2)}
              size={featured ? "article" : "wire"}
            />
          )}
        </div>
      ) : null}

      <Link
        to="/n/$slug"
        params={{ slug }}
        search={{ from }}
        className="group block p-5 pb-2"
      >
        <div className="flex items-center justify-between gap-3">
          <TagBadge tag={article.tag} />
          <time className="font-mono text-[11px] tabular-nums text-subtle">
            {formatTime(article.publishedAt)}
          </time>
        </div>

        <h2
          className={
            featured
              ? "mt-4 font-display text-xl font-medium leading-snug text-foreground sm:text-2xl group-hover:text-azure transition-colors"
              : "mt-3 font-display text-lg font-medium leading-snug text-foreground group-hover:text-azure transition-colors"
          }
        >
          {article.headline}
        </h2>

        <p className="mt-2 font-news text-[15px] leading-[1.6] text-muted line-clamp-3">
          {article.dek}
        </p>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-subtle">
            {article.category}
          </span>
          {article.tickers.slice(0, 4).map((t) => (
            <span
              key={t}
              className="rounded-sm border border-border px-1.5 py-0.5 font-mono text-[10px] text-muted"
            >
              {t}
            </span>
          ))}
        </div>
      </Link>
      <div className="px-5 pb-3">
        <ShareBar title={article.headline} path={path} />
      </div>
    </article>
  );
}
