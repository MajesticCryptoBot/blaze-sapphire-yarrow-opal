import { Link, createFileRoute, notFound } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { CopyLink } from "@/components/copy-link";
import { TagBadge } from "@/components/tag-badge";
import { formatTime, getArticle, getRelated, telegramCaption } from "@/lib/news";

export const Route = createFileRoute("/n/$slug")({
  component: ArticlePage,
  loader: ({ params }) => {
    const article = getArticle(params.slug);
    if (!article) throw notFound();
    return { article };
  },
  head: ({ loaderData }) => ({
    meta: [
      {
        title: loaderData
          ? `${loaderData.article.tag}: ${loaderData.article.headline} · ASP`
          : "Alpha Signals Pro",
      },
    ],
  }),
});

function ArticlePage() {
  const { article } = Route.useLoaderData();
  const related = getRelated(article);
  const path = `/n/${article.slug}`;

  return (
    <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <Link
        to="/"
        className="inline-flex h-11 items-center gap-2 text-sm text-muted hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        Back to the wire
      </Link>

      <article className="mt-6 grid gap-10 lg:grid-cols-[minmax(0,1fr)_280px]">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <TagBadge tag={article.tag} />
            <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-subtle">
              {article.category}
            </span>
            <time className="font-mono text-[11px] tabular-nums text-subtle">
              {formatTime(article.publishedAt)} UTC
            </time>
          </div>

          <h1 className="mt-4 font-display text-3xl font-medium sm:text-4xl">
            {article.headline}
          </h1>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-muted">{article.dek}</p>

          <div className="mt-6 flex flex-wrap gap-2">
            <CopyLink path={path} />
            <CopyLink path={path} label="Copy for Telegram" />
          </div>

          <div className="mt-8 rounded-md border border-border bg-surface p-4">
            <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-subtle">
              Telegram caption
            </p>
            <p className="mt-2 text-sm leading-relaxed text-foreground">
              {telegramCaption(article)}
            </p>
          </div>

          <div className="mt-10 space-y-5 text-[17px] leading-7 text-foreground/92">
            {article.body.map((p) => (
              <p key={p.slice(0, 24)}>{p}</p>
            ))}
          </div>
        </div>

        <aside className="space-y-6">
          <div className="rounded-lg border border-border bg-surface p-5">
            <h2 className="font-mono text-[11px] uppercase tracking-[0.16em] text-subtle">
              Key facts
            </h2>
            <dl className="mt-4 space-y-3">
              {article.keyFacts.map((f) => (
                <div key={f.label} className="flex flex-col gap-0.5 border-b border-border pb-3 last:border-0 last:pb-0">
                  <dt className="text-xs text-subtle">{f.label}</dt>
                  <dd className="font-mono text-sm tabular-nums">{f.value}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="rounded-lg border border-border bg-surface p-5">
            <h2 className="font-mono text-[11px] uppercase tracking-[0.16em] text-subtle">
              Tickers
            </h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {article.tickers.map((t) => (
                <span
                  key={t}
                  className="rounded-sm border border-border px-2 py-1 font-mono text-xs"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>

          {related.length ? (
            <div>
              <h2 className="font-mono text-[11px] uppercase tracking-[0.16em] text-subtle">
                Related
              </h2>
              <ul className="mt-3 space-y-3">
                {related.map((r) => (
                  <li key={r.slug}>
                    <Link
                      to="/n/$slug"
                      params={{ slug: r.slug }}
                      className="block text-sm leading-snug text-muted hover:text-foreground"
                    >
                      <TagBadge tag={r.tag} />
                      <span className="mt-2 block">{r.headline}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </aside>
      </article>
    </main>
  );
}
