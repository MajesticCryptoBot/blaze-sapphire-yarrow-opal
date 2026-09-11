import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

type StoryVideoProps = {
  id: number;
  mimeType?: string | null;
  size?: "wire" | "article" | "card";
};

export function StoryVideo({ id, mimeType = "video/mp4", size = "article" }: StoryVideoProps) {
  const ref = useRef<HTMLVideoElement>(null);
  const src = `/api/telegram-video?id=${id}`;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.muted = true;
    el.playsInline = true;
    el.setAttribute("webkit-playsinline", "true");
    el.setAttribute("playsinline", "true");

    const tryPlay = () => {
      el.muted = true;
      void el.play().catch(() => {});
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) tryPlay();
        else el.pause();
      },
      { threshold: 0.35 },
    );
    io.observe(el);
    tryPlay();
    return () => io.disconnect();
  }, [id]);

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
        preload="auto"
        controls
      >
        <source src={src} type={mimeType || "video/mp4"} />
      </video>
    </div>
  );
}
