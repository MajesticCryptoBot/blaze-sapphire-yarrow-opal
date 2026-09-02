import { Link, createFileRoute } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { TagBadge } from "@/components/tag-badge";
import { formatTime, detectTag } from "@/lib/news";
import { getTelegramPost, parsePublicId } from "@/lib/telegram-feed";

export const Route = createFileRoute("/n/$slug")({
  loader: async ({ params }) => {
    const id = parsePublicId(params.slug);
    if (id === null) return { post: null };
    return { post: await getTelegramPost(id) };
  },
  head: () => ({
    meta: [{ title: "Alpha Signals Pro" }],
  }),
  component: ArticlePage,
});

function ArticlePage() {
  const { post } = Route.useLoaderData();

  if (!post) {
    return (
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <Link to="/" className="inline-flex h-11 items-center gap-2 text-sm text-muted hover:text-foreground">
          <ArrowLeft className="size-4" />
          Back to the wire
        </Link>
        <p className="mt-8 text-sm text-muted">This story is no longer available.</p>
      </main>
    );
  }

  const lines = post.text.split("\n");
  const headline = lines[0] || post.text.slice(0, 100);
  const body = lines.slice(1).join("\n") || post.text;
  const tag = detectTag(post.text);

  return (
    <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <Link to="/" className="inline-flex h-11 items-center gap-2 text-sm text-muted hover:text-foreground">
        <ArrowLeft className="size-4" />
        Back to the wire
      </Link>

      <article className="mt-6 max-w-3xl">
        <div className="flex flex-wrap items-center gap-3">
          <TagBadge tag={tag} />
          <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-subtle">Telegram</span>
          <time className="font-mono text-[11px] tabular-nums text-subtle">{formatTime(post.publishedAt)} UTC</time>
        </div>

        <h1 className="mt-4 font-display text-3xl font-medium sm:text-4xl">{headline}</h1>

        {post.hasPhoto ? (
          <div className="mt-6 flex max-h-[600px] w-full items-center justify-center overflow-hidden rounded-md bg-background">
            <img src={`/api/telegram-photo?id=${post.id}`} alt="" loading="eager" className="max-h-[600px] w-full object-contain" />
          </div>
        ) : null}

        <div className="mt-8 space-y-5 text-[17px] leading-7 text-foreground/92">
          {body.split("\n").map((paragraph, index) => <p key={index}>{paragraph}</p>)}
        </div>

        {post.messageUrl ? (
          <div className="mt-8 rounded-md border border-border bg-surface p-4">
            <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-subtle">Original source</p>
            <a href={post.messageUrl} target="_blank" rel="noreferrer" className="mt-2 inline-flex items-center gap-1 text-sm text-primary hover:underline">
              View on Telegram →
            </a>
          </div>
        ) : null}
      </article>
    </main>
  );
}
