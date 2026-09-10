import { cn } from "@/lib/utils";

type StoryVideoProps = { id: number; mimeType?: string | null; size?: "wire" | "article" | "card" };

export function StoryVideo({ id, mimeType = "video/mp4", size = "article" }: StoryVideoProps) {
  return (
    <div className="overflow-hidden rounded-md bg-elevated">
      <video
        className={cn("w-full bg-black object-contain", size === "card" ? "max-h-[220px]" : size === "wire" ? "max-h-[420px]" : "max-h-[560px]")}
        controls
        autoPlay
        muted
        playsInline
        preload="auto"
      >
        <source src={`/api/telegram-video?id=${id}`} type={mimeType || "video/mp4"} />
        Your browser does not support video playback.
      </video>
    </div>
  );
}
