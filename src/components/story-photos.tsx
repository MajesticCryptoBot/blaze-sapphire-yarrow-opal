import { cn } from "@/lib/utils";

type StoryPhotosProps = {
  id: number;
  hasPhoto: boolean;
  hasPhoto2?: boolean;
  size?: "wire" | "article";
};

export function StoryPhotos({ id, hasPhoto, hasPhoto2 = false, size = "wire" }: StoryPhotosProps) {
  if (!hasPhoto) return null;

  const first = `/api/telegram-photo?id=${id}&photo=1`;
  const second = `/api/telegram-photo?id=${id}&photo=2`;
  const pair = size === "article" ? "aspect-[4/3] max-h-[320px]" : "aspect-[4/3] max-h-[240px]";
  const single = size === "article" ? "max-h-[560px] object-contain" : "max-h-[360px] object-contain";

  if (hasPhoto2) {
    return (
      <div className="grid grid-cols-2 gap-[3px] overflow-hidden rounded-md bg-elevated">
        <img src={first} alt="" loading="eager" className={cn("h-full w-full object-cover", pair)} />
        <img src={second} alt="" loading="eager" className={cn("h-full w-full object-cover", pair)} />
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-md bg-elevated">
      <img src={first} alt="" loading="eager" className={cn("w-full", single)} />
    </div>
  );
}
