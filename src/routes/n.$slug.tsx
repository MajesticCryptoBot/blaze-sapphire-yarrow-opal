import { Link, createFileRoute } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { StoryPhotos } from "@/components/story-photos";
import { StoryVideo } from "@/components/story-video";
import { TagBadge } from "@/components/tag-badge";
import { formatTime } from "@/lib/news";
import { parsePublicId, splitHeadline, tagFromText, type TelegramPost } from "@/lib/telegram-feed";

export const Route = createFileRoute("/n/$slug")({
  loader: async ({ params }) => {
    const id = parsePublicId(params.slug);
    if (id === null) return { post: null as TelegramPost | null };

    const response = await fetch(`/api/news/${id}`);
    if (!response.ok) return { post: null as TelegramPost | null };
    const payload = (await response.json()) as { post?: TelegramPost };
    return { post: payload.post ?? null };
  },
  head: () => ({ meta: [{ title: "Alpha Signals Pro" }] }),
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

  const { headline, dek } = splitHeadline(post.text);
  const body = dek ? [dek] : [headline];
  const tag = tagFromText(post.text);

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

        {post.hasVideo ? (
          <div className="mt-6">
            <StoryVideo id={post.id} mimeType={post.videoMimeType} />
          </div>
        ) : post.hasPhoto ? (
          <div className="mt-6">
            <StoryPhotos
              id={post.id}
              hasPhoto={post.hasPhoto}
              hasPhoto2={post.hasPhoto2}
              size="article"
            />
          </div>
        ) : null}

        <div className="mt-8 space-y-5 text-[17px] leading-7 text-foreground/92">
          {body.map((paragraph, index) => <p key={index}>{paragraph}</p>)}
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
