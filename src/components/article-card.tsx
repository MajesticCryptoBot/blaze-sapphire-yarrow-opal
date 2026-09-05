import { Link } from "@tanstack/react-router";
import { TagBadge } from "@/components/tag-badge";
import { formatTime, type Article } from "@/lib/news";

type ArticleWithTelegram = Article & {
  _telegramId?: number;
  _hasPhoto?: boolean;
  _messageUrl?: string | null;
};

export function ArticleCard({ article, featured = false }: { article: ArticleWithTelegram; featured?: boolean }) {
  // Generate the slug (all posts are now Telegram posts)
  const slug = article._telegramId ? `telegram-${article._telegramId}` : article.slug;
  
  return (
    <Link
      to="/n/$slug"
      params={{ slug: slug }}
      className="group block rounded-lg border border-border bg-surface p-5 transition-[border-color,transform] duration-[var(--motion-fast)] ease-[var(--ease-out)] hover:border-ring/40 hover:shadow-lg"
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
            ? "mt-4 font-display text-xl font-medium leading-snug text-foreground sm:text-2xl group-hover:text-primary transition-colors"
            : "mt-3 font-display text-lg font-medium leading-snug text-foreground group-hover:text-primary transition-colors"
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
  );
}
