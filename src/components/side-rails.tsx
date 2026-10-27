import { useEffect, useState } from "react";
import { formatTime } from "@/lib/news";
import { splitHeadline, type TelegramPost } from "@/lib/telegram-feed";
import { storyPath } from "@/lib/story-url";

/**
 * Editorial side rail — a quiet, useful companion for the wide-screen margin.
 *
 * Only the newest-headlines rail remains: the token-price rail that used to
 * sit on the left duplicated the ticker bar and collided with the nav drawer
 * when it opened, so it was removed. This rail appears only on viewports wide
 * enough to have real blank space (≥ 1760px), hides itself on any fetch
 * failure — it decorates, never disturbs.
 */

const RAIL_REFRESH_MS = 60_000;

function useHeadlines(enabled: boolean) {
  const [posts, setPosts] = useState<TelegramPost[]>([]);

  useEffect(() => {
    if (!enabled) return;
    let active = true;
    const load = async () => {
      try {
        const response = await fetch("/api/news", { cache: "no-store" });
        if (!response.ok) return;
        const payload = (await response.json()) as { posts?: TelegramPost[] };
        if (active) setPosts(payload.posts ?? []);
      } catch {
        // leave the rail empty — it hides itself
      }
    };
    void load();
    const timer = window.setInterval(load, RAIL_REFRESH_MS);
    return () => {
      active = false;
      window.clearInterval(timer);
    };
  }, [enabled]);

  return posts;
}

function HeadlinesRail() {
  const posts = useHeadlines(true);
  const items = posts.slice(0, 6);
  if (items.length === 0) return null;

  return (
    <aside className="side-rail side-rail-right" aria-label="Latest headlines">
      <p className="side-rail-label">Latest on the wire</p>
      <ul className="side-rail-list">
        {items.map((post) => {
          const { headline } = splitHeadline(post.text);
          return (
            <li key={post.id} className="side-rail-headline">
              <a href={storyPath(post.id)} className="side-rail-link group">
                <time className="font-mono text-[9px] uppercase tracking-[0.12em] text-subtle">
                  {formatTime(post.publishedAt)}
                </time>
                <span className="mt-0.5 line-clamp-2 block font-news text-[12.5px] leading-snug text-muted transition-colors duration-[var(--motion-quick)] group-hover:text-azure">
                  {headline}
                </span>
              </a>
            </li>
          );
        })}
      </ul>
    </aside>
  );
}

export function SideRails() {
  return <HeadlinesRail />;
}
