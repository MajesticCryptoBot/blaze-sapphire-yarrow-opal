import { cn } from "@/lib/utils";

type StoryPhotosProps = {
  id: number;
  hasPhoto: boolean;
  hasPhoto2?: boolean;
  size?: "wire" | "article";
};

/**
 * Uniform editorial media block.
 *
 * Every photo on the site — card, featured story, or article hero — renders in
 * the exact same 16:9 frame, so decks and grids line up with the clean rhythm
 * of a professional news site. `object-cover` center-crops just enough to fill
 * the frame without distortion (the standard used by major news outlets); the
 * crop is gentle because 16:9 matches the shape of most wire photos.
 *
 * Photo pairs split the same frame into two equal halves (Telegram album
 * style), so a two-photo story occupies exactly the same height as a
 * one-photo story.
 */
export function StoryPhotos({ id, hasPhoto, hasPhoto2 = false, size = "wire" }: StoryPhotosProps) {
  if (!hasPhoto) return null;

  const first = `/api/telegram-photo?id=${id}&photo=1`;
  const second = `/api/telegram-photo?id=${id}&photo=2`;
  // Above-the-fold media (featured story / article hero) loads eagerly;
  // grid-card media lazy-loads so a 20-story deck stays fast.
  const loading = size === "article" ? "eager" : "lazy";

  if (hasPhoto2) {
    return (
      <div className="aspect-[16/9] w-full overflow-hidden rounded-md bg-elevated">
        <div className="grid h-full w-full grid-cols-2 gap-[3px]">
          <img
            src={first}
            alt=""
            loading={loading}
            decoding="async"
            className="h-full w-full object-cover object-center"
          />
          <img
            src={second}
            alt=""
            loading={loading}
            decoding="async"
            className="h-full w-full object-cover object-center"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="aspect-[16/9] w-full overflow-hidden rounded-md bg-elevated">
      <img
        src={first}
        alt=""
        loading={loading}
        decoding="async"
        className={cn("h-full w-full object-cover object-center", size === "article" && "object-[center_35%]")}
      />
    </div>
  );
}
