import { Link, createFileRoute, notFound } from "@tanstack/react-router";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { CopyLink } from "@/components/copy-link";
import { TagBadge } from "@/components/tag-badge";
import { formatTime } from "@/lib/news";
import {
  TELEGRAM_CHANNEL,
  TELEGRAM_URL,
  getTelegramPost,
  parsePublicId,
  splitHeadline,
  tagFromText,
} from "@/lib/telegram-feed";

export const Route = createFileRoute("/n/$slug")({
  component: ArticlePage,
  loader: async ({ params }) => {
    const id = parsePublicId(params.slug);
    if (!id) throw notFound();
    const post = await getTelegramPost(id);
    if (!post) throw notFound();
    return { post, slug: params.slug };
  },
  head: ({ loaderData }) => {
    const headline = loaderData ? splitHeadline(loaderData.post.text).headline : "Alpha Signals Pro";
    return {
      meta: [
        { title: `${headline} · ASP` },
        {
          name: "description",
          content: loaderData?.post.text.slice(0, 180) ?? "Alpha Signals Pro market brief.",
        },
      ],
    };
  },
});

function ArticlePage() {
  const { post, slug } = Route.useLoaderData();
  const { headline, body } = splitHeadline(post.text);
  const paragraphs = body.length ? body : [post.text];

  return (
    <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link
          to="/"
          className="inline-flex h-11 items-center gap-2 text-sm text-muted hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          Back to the wire
        </Link>
        <CopyLink path={`/n/${slug}`} label="Copy link" />
      </div>

      <article className="mt-6 max-w-3xl">
        <div className="flex flex-wrap items-center gap-3">
          <TagBadge tag={tagFromText(post.text)} />
          <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-subtle">
            @{TELEGRAM_CHANNEL}
          </span>
          <time className="font-mono text-[11px] tabular-nums text-subtle">
            {formatTime(post.publishedAt)} UTC
          </time>
        </div>

        <h1 className="mt-4 font-display text-3xl font-medium sm:text-4xl">
          {headline}
        </h1>

        {post.hasPhoto ? (
          <div className="mt-6 overflow-hidden rounded-md bg-elevated">
            <img
              src={`/api/telegram-photo?id=${post.id}`}
              alt=""
              loading="eager"
              className="max-h-[640px] w-full object-contain"
            />
          </div>
        ) : null}

        <div className="mt-8 space-y-5 text-[17px] leading-7 text-foreground/92">
          {paragraphs.map((paragraph, index) => (
            <p key={`${index}-${paragraph.slice(0, 24)}`}>{paragraph}</p>
          ))}
        </div>

        <div className="mt-10 flex flex-wrap items-center gap-4 border-t border-border pt-6">
          <a
            href={post.messageUrl || TELEGRAM_URL}
            target="_blank"
            rel="noreferrer"
            className="inline-flex h-11 items-center gap-2 text-sm text-muted hover:text-foreground"
          >
            View on Telegram
            <ExternalLink className="size-3.5" />
          </a>
        </div>
      </article>
    </main>
  );
}
