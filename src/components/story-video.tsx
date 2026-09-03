type StoryVideoProps = {
  id: number;
  mimeType?: string | null;
};

export function StoryVideo({ id, mimeType = "video/mp4" }: StoryVideoProps) {
  return (
    <div className="overflow-hidden rounded-md bg-elevated">
      <video
        className="max-h-[560px] w-full object-contain"
        controls
        playsInline
        preload="metadata"
        poster=""
      >
        <source src={`/api/telegram-video?id=${id}`} type={mimeType || "video/mp4"} />
        Your browser does not support video playback.
      </video>
    </div>
  );
}
