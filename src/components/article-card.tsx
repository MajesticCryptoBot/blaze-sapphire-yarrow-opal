import { StoryPhotos } from "@/components/story-photos";
import { StoryVideo } from "@/components/story-video";
import { ShareBar } from "@/components/share-bar";
import { formatTime, type Article } from "@/lib/news";
import { fitCardPhotos } from "@/lib/photo-fit";
import { storyPath } from "@/lib/story-url";

type ArticleWithTelegram = Article & {
  _telegramId?: number;
  _hasPhoto?: boolean;
  _hasPhoto2?: boolean;
  _hasVideo?: boolean;
  _videoMimeType?: string | null;
  _videoUrl?: string | null;
  _messageUrl?: string | null;
  _photoW?: number | null;
  _photoH?: number | null;
  _photo2W?: number | null;
  _photo2H?: number | null;
};

export function ArticleCard({
  article,
  featured = false,
  from = "",
  withPhoto = false,
  withVideo = false,
}: {
  article: ArticleWithTelegram;
  featured?: boolean;
  from?: string;
  /** Media are a main-deck treatment (homepage featured slot) — every other
   *  card stays text-first. */
  withPhoto?: boolean;
  /** The dedicated Videos desk keeps video players on its cards. */
  withVideo?: boolean;
}) {
  const slug = article._telegramId ? `telegram-${article._telegramId}` : article.slug;
  const path = storyPath(article._telegramId ?? slug);
  const storyHref = from ? `${path}?from=${encodeURIComponent(from)}` : path;
  // "Check size, fit, or drop": the photo is measured against the uniform
  // 16:9 deck frame and only earns a card slot when at least 80% of it stays
  // visible. Photos that fail keep the card text-first; their photo lives in
  // the full story view.
  const fit = fitCardPhotos({
    hasPhoto: Boolean(article._hasPhoto),
    hasPhoto2: Boolean(article._hasPhoto2),
    photoW: article._photoW,
    photoH: article._photoH,
    photo2W: article._photo2W,
    photo2H: article._photo2H,
  });
  // Original homepage behaviour restored: media is a main-deck treatment.
  // `withPhoto` is passed only by the homepage's featured slot — every other
  // card (homepage grid, topic desks, search results) stays text-first and
  // can never render a photo OR a video. On the main deck a fitting photo
  // always wins over a video; a video appears only when the story has no
  // card-worthy photo, so a video attachment can never strip photos from
  // cards again. The only exception is the dedicated Videos desk
  // (`withVideo`), whose cards are video players by design. The telegram
  // wire and the full story view render media as before.
  const hasPhotos = withPhoto && fit.mode !== "none";
  const hasVideo =
    Boolean(article._telegramId && article._hasVideo) &&
    (withVideo || (withPhoto && !hasPhotos));
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
              variant="deck"
              eager={featured}
              photoW={article._photoW}
              photoH={article._photoH}
              photo2W={article._photo2W}
              photo2H={article._photo2H}
              mode={fit.mode === "pair" ? "pair" : "single"}
              solo={fit.solo}
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
