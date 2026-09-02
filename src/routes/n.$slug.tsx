import { Link, createFileRoute } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { TagBadge } from "@/components/tag-badge";
import { formatTime, detectTag } from "@/lib/news";

// Types for Telegram posts
type TelegramPost = {
  id: number;
  text: string;
  publishedAt: string;
  hasPhoto: boolean;
  messageUrl: string | null;
};

const STORAGE_KEY = "telegram_rolling_window";

// Read the browser's rolling archive. This must only run in the browser;
// route loaders can also run during SSR where localStorage does not exist.
function getTelegramPostFromStorage(id: number): TelegramPost | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return null;
    const posts = JSON.parse(stored) as TelegramPost[];
    return posts.find((post) => post.id === id) ?? null;
  } catch {
    return null;
  }
}

export const Route = createFileRoute("/n/$slug")({
  component: ArticlePage,
  loader: ({ params }) => {
    // Validate the URL shape in the loader, but do not try to read
    // localStorage here. TanStack Router may execute this loader on the server.
    if (!params.slug.startsWith("telegram-")) {
      return { id: null };
    }

    const id = Number(params.slug.replace("telegram-", ""));
    return { id: Number.isFinite(id) ? id : null };
  },
  head: ({ loaderData }) => ({
    meta: [
      {
        title: "Alpha Signals Pro",
      },
    ],
  }),
});

function ArticlePage() {
  const { id } = Route.useLoaderData();
  const [post, setPost] = useState<TelegramPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    const loadPost = async () => {
      if (id === null) {
        if (active) setLoading(false);
        return;
      }

      // First use the locally cached archive. This keeps older stories
      // available even though /api/news intentionally returns only recent posts.
      const localPost = getTelegramPostFromStorage(id);
      if (localPost) {
        if (active) {
          setPost(localPost);
          setLoading(false);
        }
        return;
      }

      // Direct links may be opened without first visiting the homepage, so
      // fall back to the public news API for the recent Telegram window.
      try {
        const response = await fetch("/api/news");
        if (!response.ok) throw new Error("news request failed");
        const payload = (await response.json()) as { posts?: TelegramPost[] };
        const remotePost = (payload.posts ?? []).find((item) => item.id === id) ?? null;

        if (active) {
          setPost(remotePost);
          setLoading(false);
        }
      } catch {
        if (active) {
          setPost(null);
          setLoading(false);
        }
      }
    };

    void loadPost();
    return () => {
      active = false;
    };
  }, [id]);

  if (loading) {
    return (
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <Link
          to="/"
          className="inline-flex h-11 items-center gap-2 text-sm text-muted hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          Back to the wire
        </Link>
        <p className="mt-8 text-sm text-muted">Loading story…</p>
      </main>
    );
  }

  if (!post) {
    return (
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <Link
          to="/"
          className="inline-flex h-11 items-center gap-2 text-sm text-muted hover:text-foreground"
        >
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
      <Link
        to="/"
        className="inline-flex h-11 items-center gap-2 text-sm text-muted hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        Back to the wire
      </Link>

      <article className="mt-6 max-w-3xl">
        <div className="flex flex-wrap items-center gap-3">
          <TagBadge tag={tag} />
          <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-subtle">
            Telegram
          </span>
          <time className="font-mono text-[11px] tabular-nums text-subtle">
            {formatTime(post.publishedAt)} UTC
          </time>
        </div>

        <h1 className="mt-4 font-display text-3xl font-medium sm:text-4xl">
          {headline}
        </h1>

        {post.hasPhoto ? (
          <div className="mt-6 flex max-h-[600px] w-full items-center justify-center overflow-hidden rounded-md bg-background">
            <img
              src={`/api/telegram-photo?id=${post.id}`}
              alt=""
              loading="eager"
              className="max-h-[600px] w-full object-contain"
            />
          </div>
        ) : null}

        <div className="mt-8 space-y-5 text-[17px] leading-7 text-foreground/92">
          {body.split("\n").map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>

        {post.messageUrl ? (
          <div className="mt-8 rounded-md border border-border bg-surface p-4">
            <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-subtle">
              Original source
            </p>
            <a
              href={post.messageUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-2 inline-flex items-center gap-1 text-sm text-primary hover:underline"
            >
              View on Telegram →
            </a>
          </div>
        ) : null}
      </article>
    </main>
  );
}
