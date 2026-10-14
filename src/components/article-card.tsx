import { StoryPhotos } from "@/components/story-photos";
import { StoryVideo } from "@/components/story-video";
import { ShareBar } from "@/components/share-bar";
import { formatTime, type Article } from "@/lib/news";
import { storyPath } from "@/lib/story-url";

type ArticleWithTelegram = Article & {
  _telegramId?: number;
  _hasPhoto?: boolean;
  _hasPhoto2?: boolean;
  _hasVideo?: boolean;
  _videoMimeType?: string | null;
  _videoUrl?: string | null;
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
  const storyHref = from ? `${path}?from=${encodeURIComponent(from)}` : path;
  const hasVideo = Boolean(article._telegramId && article._hasVideo);
  const hasPhotos = Boolean(featured && article._telegramId && article._hasPhoto);
  const hasMedia = hasVideo || hasPhotos;

  return (
    <article className="overflow-hidden rounded-2xl bg-surface shadow-[var(--shadow-border)] transition-[box-shadow,transform] duration-[var(--motion-fast)] ease-[var(--ease-out)] hover:-translate-y-px hover:shadow-[var(--shadow-border-hover)]">
      {hasMedia && article._telegramId ? (
        <div className="px-3 pt-3 sm:px-4 sm:pt-4">
          {hasVideo ? (
            <StoryVideo
              id={article._telegramId}
              mimeType={article._videoMimeType}
              videoUrl={article._videoUrl}
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

      <a href={storyHref} className="group block p-5 pb-3 sm:p-6 sm:pb-3">
        <div className="flex items-center justify-end gap-3">
          <time className="text-[11px] font-medium tabular-nums text-subtle">
            {formatTime(article.publishedAt)}
          </time>
        </div>

        <h2
          className={
            featured
              ? "mt-4 text-xl font-semibold leading-tight tracking-[-0.02em] text-foreground transition-colors duration-[var(--motion-quick)] group-hover:text-azure sm:text-2xl"
              : "mt-3 text-lg font-semibold leading-tight tracking-[-0.015em] text-foreground transition-colors duration-[var(--motion-quick)] group-hover:text-azure"
          }
        >
          {article.headline}
        </h2>

        <p className="mt-3 font-news text-[15px] leading-[1.6] text-muted line-clamp-3">
          {article.dek}
        </p>

        <div className="mt-5 flex flex-wrap items-center gap-2">
          <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-subtle">
            {article.category}
          </span>
          {article.tickers.slice(0, 4).map((t) => (
            <span
              key={t}
              className="rounded-full border border-border/80 px-2 py-0.5 text-[10px] font-medium text-muted"
            >
              {t}
            </span>
          ))}
        </div>
      </a>
      <div className="px-5 pb-4 sm:px-6">
        <ShareBar title={article.headline} path={path} />
      </div>
    </article>
  );
}
