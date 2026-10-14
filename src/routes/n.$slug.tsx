import { Link, createFileRoute } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { GlossaryText } from "@/components/glossary-text";
import { RelatedDesks } from "@/components/related-desks";
import { ShareBar } from "@/components/share-bar";
import { StoryPhotos } from "@/components/story-photos";
import { StoryVideo } from "@/components/story-video";
import { isDeskSlug } from "@/lib/desk-sections";
import { formatTime } from "@/lib/news";
import { parsePublicId, splitHeadline, getTelegramPost, type TelegramPost } from "@/lib/telegram-feed";
import { storyPath } from "@/lib/story-url";

export const Route = createFileRoute("/n/$slug")({
  validateSearch: (search: Record<string, unknown>) => ({
    from: typeof search.from === "string" ? search.from : "",
  }),
  loader: async ({ params }) => {
    const id = parsePublicId(params.slug);
    if (id === null) return { post: null as TelegramPost | null };
    try {
      const post = await getTelegramPost(id);
      return { post };
    } catch (error) {
      console.error("[story]", error instanceof Error ? error.message : error);
      return { post: null as TelegramPost | null };
    }
  },
  head: ({ loaderData }) => {
    const text = loaderData?.post?.text ?? "";
    const headline = text ? splitHeadline(text).headline : "ASP News";
    return { meta: [{ title: `${headline} — ASP News` }] };
  },
  component: ArticlePage,
});

function StoryBack({ from }: { from: string }) {
  const className = "inline-flex h-11 items-center gap-2 text-sm text-muted transition-colors hover:text-azure";

  if (from && isDeskSlug(from)) {
    return (
      <Link to="/$slug" params={{ slug: from }} className={className}>
        <ArrowLeft className="size-4" />
        Back
      </Link>
    );
  }

  return (
    <Link to="/" search={{ q: "" }} className={className}>
      <ArrowLeft className="size-4" />
      Back
    </Link>
  );
}

function ArticlePage() {
  const { post } = Route.useLoaderData();
  const { from } = Route.useSearch();

  if (!post) {
    return (
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <StoryBack from={from} />
        <p className="mt-8 text-sm text-muted">This story is no longer available.</p>
      </main>
    );
  }

  const { headline, dek } = splitHeadline(post.text);
  const body = dek ? [dek] : [headline];
  const path = storyPath(post.id);

  return (
    <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <StoryBack from={from} />

      <article className="mt-6 max-w-3xl">
        <div className="flex flex-wrap items-center gap-3">
          <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-subtle">Telegram</span>
          <time className="font-mono text-[11px] tabular-nums text-subtle">{formatTime(post.publishedAt)} UTC</time>
        </div>

        <h1 className="mt-4 font-display text-3xl font-medium sm:text-4xl">{headline}</h1>

        {post.hasVideo ? (
          <div className="mt-6">
            <StoryVideo id={post.id} mimeType={post.videoMimeType} videoUrl={post.videoUrl} size="article" />
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

        <div className="mt-8 space-y-5 font-news text-[18px] leading-[1.6] text-foreground">
          {body.map((paragraph, index) => (
            <p key={index}>
              <GlossaryText text={paragraph} />
            </p>
          ))}
        </div>

        <div className="mt-6 border-t border-border pt-2">
          <ShareBar title={headline} path={path} />
        </div>

        <RelatedDesks text={post.text} />

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
