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
 * of a professional news site.
 *
 * Framing rule: `object-contain`, never `object-cover`. Wire photos often
 * carry information (logos, tickers, chart labels, headlines inside the
 * image), so cropping to fill the frame silently hides parts of the story.
 * Instead the photo is shown whole, letterboxed over a blurred, scaled copy of
 * itself — the "cinematic fill" treatment used by premium news apps. The frame
 * stays perfectly uniform and no information is ever cut away.
 *
 * Photo pairs split the same frame into two equal halves (Telegram album
 * style), so a two-photo story occupies exactly the same height as a
 * one-photo story.
 */
function FramedPhoto({ src, loading }: { src: string; loading: "eager" | "lazy" }) {
  return (
    <div className="relative h-full w-full bg-elevated">
      {/* Blurred self-backdrop: fills the letterbox area so the frame never
          shows flat bars, while the real photo above stays 100% uncropped. */}
      <img
        src={src}
        alt=""
        aria-hidden
        loading={loading}
        decoding="async"
        className="absolute inset-0 h-full w-full scale-125 object-cover opacity-45 blur-2xl"
      />
      <img
        src={src}
        alt=""
        loading={loading}
        decoding="async"
        className="relative h-full w-full object-contain"
      />
    </div>
  );
}

export function StoryPhotos({ id, hasPhoto, hasPhoto2 = false, size = "wire" }: StoryPhotosProps) {
  if (!hasPhoto) return null;

  const first = `/api/telegram-photo?id=${id}&photo=1`;
  const second = `/api/telegram-photo?id=${id}&photo=2`;
  // Above-the-fold media (featured story / article hero) loads eagerly;
  // grid-card media lazy-loads so a 20-story deck stays fast.
  const loading = size === "article" ? "eager" : "lazy";

  if (hasPhoto2) {
    return (
      <div className={cn("aspect-[16/9] w-full overflow-hidden rounded-md")}>
        <div className="grid h-full w-full grid-cols-2 gap-[3px]">
          <FramedPhoto src={first} loading={loading} />
          <FramedPhoto src={second} loading={loading} />
        </div>
      </div>
    );
  }

  return (
    <div className={cn("aspect-[16/9] w-full overflow-hidden rounded-md")}>
      <FramedPhoto src={first} loading={loading} />
    </div>
  );
}
