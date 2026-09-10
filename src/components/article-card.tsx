import { Link } from "@tanstack/react-router";
import { StoryPhotos } from "@/components/story-photos";
import { StoryVideo } from "@/components/story-video";
import { ShareMenu } from "@/components/share-menu";
import { TagBadge } from "@/components/tag-badge";
import { formatTime, type Article } from "@/lib/news";

type ArticleWithTelegram = Article & { _telegramId?: number; _hasPhoto?: boolean; _hasPhoto2?: boolean; _hasVideo?: boolean; _videoMimeType?: string | null; _messageUrl?: string | null };

export function ArticleCard({ article, featured = false, from = "" }: { article: ArticleWithTelegram; featured?: boolean; from?: string }) {
  const slug = article._telegramId ? `telegram-${article._telegramId}` : article.slug;
  const hasVideo = Boolean(article._telegramId && article._hasVideo);
  const hasPhotos = Boolean(featured && article._telegramId && article._hasPhoto);
  const hasMedia = hasVideo || hasPhotos;
  const shareUrl = article._telegramId ? `https://aspnews.vercel.app/n/${slug}` : `https://aspnews.vercel.app/n/${article.slug}`;
  return (
    <div className="group rounded-lg border border-border bg-surface p-5 transition-[border-color,transform] duration-[var(--motion-fast)] ease-[var(--ease-out)] hover:border-ring/40 hover:shadow-lg">
      <Link to="/n/$slug" params={{ slug }} search={{ from }} className="block">
        <div className="flex items-center justify-between gap-3"><TagBadge tag={article.tag} /><time className="font-mono text-[11px] tabular-nums text-subtle">{formatTime(article.publishedAt)}</time></div>
        {hasMedia && article._telegramId ? <div className="mt-4" onClick={hasVideo ? (event) => event.preventDefault() : undefined} onPointerDown={hasVideo ? (event) => event.stopPropagation() : undefined}>{hasVideo ? <StoryVideo id={article._telegramId} mimeType={article._videoMimeType} size={featured ? "article" : "card"} /> : <StoryPhotos id={article._telegramId} hasPhoto={Boolean(article._hasPhoto)} hasPhoto2={Boolean(article._hasPhoto2)} size={featured ? "article" : "wire"} />}</div> : null}
        <h2 className={featured ? "mt-4 font-display text-xl font-medium leading-snug text-foreground sm:text-2xl group-hover:text-azure transition-colors" : "mt-3 font-display text-lg font-medium leading-snug text-foreground group-hover:text-azure transition-colors"}>{article.headline}</h2>
        <p className="mt-2 font-news text-[15px] leading-[1.6] text-muted line-clamp-3">{article.dek}</p>
        <div className="mt-4 flex flex-wrap items-center gap-2"><span className="font-mono text-[10px] uppercase tracking-[0.14em] text-subtle">{article.category}</span>{article.tickers.slice(0, 4).map((t) => <span key={t} className="rounded-sm border border-border px-1.5 py-0.5 font-mono text-[10px] text-muted">{t}</span>)}</div>
      </Link>
      <div className="mt-3 border-t border-border pt-2"><ShareMenu url={shareUrl} title={article.headline} /></div>
    </div>
  );
}
