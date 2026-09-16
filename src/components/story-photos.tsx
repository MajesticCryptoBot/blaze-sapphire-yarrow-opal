import { cn } from "@/lib/utils";

type StoryPhotosProps = {
  id: number;
  hasPhoto: boolean;
  hasPhoto2?: boolean;
  /** wire/card = homepage cards (fixed frame). article = story page (can be taller). */
  size?: "wire" | "article";
};

export function StoryPhotos({ id, hasPhoto, hasPhoto2 = false, size = "wire" }: StoryPhotosProps) {
  if (!hasPhoto) return null;

  const first = `/api/telegram-photo?id=${id}&photo=1`;
  const second = `/api/telegram-photo?id=${id}&photo=2`;

  // Homepage / card: one shared frame so 1-photo and 2-photo posts look the same height.
  if (size !== "article") {
    const frame = "aspect-[16/10] w-full";
    if (hasPhoto2) {
      return (
        <div className={cn("grid grid-cols-2 gap-[3px] overflow-hidden rounded-md bg-elevated", frame)}>
          <img src={first} alt="" loading="lazy" className="h-full w-full object-cover" />
          <img src={second} alt="" loading="lazy" className="h-full w-full object-cover" />
        </div>
      );
    }
    return (
      <div className={cn("overflow-hidden rounded-md bg-elevated", frame)}>
        <img src={first} alt="" loading="lazy" className="h-full w-full object-cover" />
      </div>
    );
  }

  // Story page: keep richer layout (unchanged experience when reading full post).
  if (hasPhoto2) {
    return (
      <div className="grid grid-cols-2 gap-[3px] overflow-hidden rounded-md bg-elevated">
        <img
          src={first}
          alt=""
          loading="eager"
          className="h-full w-full max-h-[320px] aspect-[4/3] object-cover"
        />
        <img
          src={second}
          alt=""
          loading="eager"
          className="h-full w-full max-h-[320px] aspect-[4/3] object-cover"
        />
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-md bg-elevated">
      <img src={first} alt="" loading="eager" className="w-full max-h-[560px] object-contain" />
    </div>
  );
}
