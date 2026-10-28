import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

type StoryVideoProps = {
  id: number;
  mimeType?: string | null;
  videoUrl?: string | null;
  size?: "wire" | "article" | "card";
};

export function StoryVideo({ id, mimeType = "video/mp4", videoUrl, size = "article" }: StoryVideoProps) {
  const ref = useRef<HTMLVideoElement>(null);
  const src = videoUrl || `/api/telegram-video?id=${id}`;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.muted = true;
    el.defaultMuted = true;
    el.playsInline = true;
    el.setAttribute("muted", "");
    el.setAttribute("playsinline", "");
    el.setAttribute("webkit-playsinline", "true");

    const tryPlay = () => {
      el.muted = true;
      void el.play().catch(() => {});
    };

    const onLoaded = () => tryPlay();
    el.addEventListener("loadedmetadata", onLoaded);
    el.addEventListener("canplay", onLoaded);

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) tryPlay();
        else el.pause();
      },
      { threshold: 0.35 },
    );
    io.observe(el);
    tryPlay();

    return () => {
      io.disconnect();
      el.removeEventListener("loadedmetadata", onLoaded);
      el.removeEventListener("canplay", onLoaded);
    };
  }, [id, src]);

  return (
    <div className="overflow-hidden rounded-md bg-elevated">
      <video
        ref={ref}
        className={cn(
          "w-full bg-black object-contain",
          size === "card" ? "max-h-[220px]" : size === "wire" ? "max-h-[420px]" : "max-h-[560px]",
        )}
        src={src}
        muted
        autoPlay
        loop
        playsInline
        preload="metadata"
        controls
      >
        <source src={src} type={mimeType || "video/mp4"} />
      </video>
    </div>
  );
}
