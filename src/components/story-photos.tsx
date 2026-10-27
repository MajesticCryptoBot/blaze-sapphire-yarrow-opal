import { cn } from "@/lib/utils";

type StoryPhotosProps = {
  id: number;
  hasPhoto: boolean;
  hasPhoto2?: boolean;
  /**
   * "deck"    — one uniform 16:9 frame, photo fills it edge to edge.
   *             Only photos that passed the fit gate (src/lib/photo-fit.ts)
   *             may be routed here: at least 80% of the photo stays visible,
   *             so object-cover's residual crop is imperceptible and nothing
   *             meaningful is ever hidden.
   * "article" — the frame adapts to the photo: rendered at the photo's
   *             intrinsic ratio (when known), never cropped, on a quiet
   *             elevated surface. This is where non-fitting photos live,
   *             full and uncropped.
   */
  variant?: "deck" | "article";
  /** Above-the-fold media (featured story / article hero) loads eagerly. */
  eager?: boolean;
  /** Intrinsic pixel dimensions — keep the article view at the photo's own ratio. */
  photoW?: number | null;
  photoH?: number | null;
  photo2W?: number | null;
  photo2H?: number | null;
  /** "pair" renders both photos side by side; "single" renders only `solo`. */
  mode?: "single" | "pair";
  solo?: 1 | 2;
};

/**
 * Editorial media block — two strict presentation modes, no letterboxing,
 * no blurred backdrops, nothing "cinematic".
 *
 * Photo pairs split the deck frame into two equal halves (Telegram album
 * style), so a two-photo story occupies exactly the same height as a
 * one-photo story.
 */
function DeckPhoto({ src, eager }: { src: string; eager: boolean }) {
  return (
    <img
      src={src}
      alt=""
      loading={eager ? "eager" : "lazy"}
      decoding="async"
      className="h-full w-full object-cover"
    />
  );
}

function ArticlePhoto({
  src,
  eager,
  width,
  height,
}: {
  src: string;
  eager: boolean;
  width?: number | null;
  height?: number | null;
}) {
  const known = Boolean(width && height && width > 0 && height > 0);
  return (
    <img
      src={src}
      alt=""
      loading={eager ? "eager" : "lazy"}
      decoding="async"
      style={known ? { aspectRatio: `${width} / ${height}` } : undefined}
      className={cn(
        "mx-auto block max-h-[75vh] rounded-md bg-elevated object-contain",
        known ? "w-full" : "max-w-full",
      )}
    />
  );
}

export function StoryPhotos({
  id,
  hasPhoto,
  hasPhoto2 = false,
  variant = "deck",
  eager = false,
  photoW,
  photoH,
  photo2W,
  photo2H,
  mode = "single",
  solo = 1,
}: StoryPhotosProps) {
  if (!hasPhoto) return null;

  const first = `/api/telegram-photo?id=${id}&photo=1`;
  const second = `/api/telegram-photo?id=${id}&photo=2`;

  if (variant === "article") {
    if (hasPhoto2) {
      return (
        <div className="grid w-full grid-cols-2 gap-[3px]">
          <ArticlePhoto src={first} eager={eager} width={photoW} height={photoH} />
          <ArticlePhoto src={second} eager={eager} width={photo2W} height={photo2H} />
        </div>
      );
    }
    return <ArticlePhoto src={first} eager={eager} width={photoW} height={photoH} />;
  }

  // Deck mode — uniform 16:9 card frame.
  if (mode === "pair" && hasPhoto2) {
    return (
      <div className="aspect-[16/9] w-full overflow-hidden rounded-md">
        <div className="grid h-full w-full grid-cols-2 gap-[3px]">
          <DeckPhoto src={first} eager={eager} />
          <DeckPhoto src={second} eager={eager} />
        </div>
      </div>
    );
  }

  const soloSrc = solo === 2 ? second : first;
  return (
    <div className="aspect-[16/9] w-full overflow-hidden rounded-md">
      <DeckPhoto src={soloSrc} eager={eager} />
    </div>
  );
}
