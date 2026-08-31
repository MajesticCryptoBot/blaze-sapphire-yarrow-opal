import { Link } from "@tanstack/react-router";
import { TagBadge } from "@/components/tag-badge";
import { formatTime, type Article } from "@/lib/news";

// Extended type to include Telegram-specific fields
type ArticleWithPhoto = Article & {
  hasPhoto?: boolean;
  id?: number;
  messageUrl?: string | null;
};

export function ArticleCard({ article, featured = false }: { article: ArticleWithPhoto; featured?: boolean }) {
  const isTelegram = 'id' in article && article.id !== undefined;
  
  return (
    <Link
      to={isTelegram ? "#" : "/n/$slug"}
      params={isTelegram ? {} : { slug: article.slug }}
      className="group block rounded-lg border border-border bg-surface p-5 transition-[border-color,transform] duration-[var(--motion-fast)] ease-[var(--ease-out)] hover:border-ring/40"
    >
      <div className="flex items-center justify-between gap-3">
        <TagBadge tag={article.tag} />
        <time className="font-mono text-[11px] tabular-nums text-subtle">
          {formatTime(article.publishedAt)}
        </time>
      </div>
      
      {/* Show photo for Telegram posts */}
      {isTelegram && (article as any).hasPhoto && (
        <div className="mt-3 mb-3 flex max-h-[200px] w-full items-center justify-center overflow-hidden rounded-md bg-background">
          <img
            src={`/api/telegram-photo?id=${(article as any).id}`}
            alt=""
            loading="lazy"
            className="max-h-[200px] w-full object-contain"
          />
        </div>
      )}
      
      <h2
        className={
          featured
            ? "mt-4 font-display text-2xl font-medium leading-snug text-foreground sm:text-3xl"
            : "mt-3 font-display text-xl font-medium leading-snug text-foreground"
        }
      >
        {article.headline}
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-muted">{article.dek}</p>
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
  );
}
