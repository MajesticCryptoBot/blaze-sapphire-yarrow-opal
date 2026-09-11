import { Check, Copy, Share2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { storyAbsoluteUrl } from "@/lib/story-url";
import { cn } from "@/lib/utils";

function XMark() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="size-4 fill-current">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.74l7.727-8.825L1.254 2.25H8.08l4.253 5.622L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function TelegramMark() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="size-4 fill-current">
      <path d="M21.7 3.3 18.6 20c-.2 1.2-.9 1.5-1.8.9l-5-3.7-2.4 2.3c-.3.3-.5.5-1 .5l.4-5.1 9.3-8.4c.4-.4-.1-.6-.6-.2L6 13.6l-4.9-1.5c-1.1-.3-1.1-1.1.2-1.6L20.5 2c.9-.3 1.7.2 1.2 1.3Z" />
    </svg>
  );
}

function WhatsAppMark() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="size-4 fill-current">
      <path d="M17.5 14.4c-.3-.1-1.6-.8-1.8-.9s-.4-.1-.6.1-.7.9-.8 1.1-.3.2-.6.1a7.5 7.5 0 0 1-2.2-1.4 8.3 8.3 0 0 1-1.5-1.9c-.2-.3 0-.4.1-.6l.4-.5.2-.4c.1-.1 0-.3 0-.4s-.6-1.4-.8-1.9-.4-.4-.6-.4h-.5c-.2 0-.4.1-.6.3s-.8.8-.8 1.9.8 2.2.9 2.3a9.7 9.7 0 0 0 3.7 3.4c1.4.6 1.9.6 2.6.5.4 0 1.3-.5 1.5-1s.2-.9.1-1-.1-.1-.4-.2ZM12.04 21.5h-.1A9.5 9.5 0 0 1 5 19.3L2.7 20l.7-2.3a9.5 9.5 0 1 1 8.6 3.8Zm8.46-17A11.5 11.5 0 0 0 2.7 17.5L1 23l5.6-1.5A11.5 11.5 0 0 0 20.5 4.5Z" />
    </svg>
  );
}

function FacebookMark() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="size-4 fill-current">
      <path d="M13.5 21v-7h2.4l.4-3h-2.8V9.1c0-.9.3-1.5 1.6-1.5H16.5V4.8c-.3 0-1.2-.1-2.3-.1-2.3 0-3.8 1.4-3.8 3.9V11H8v3h2.4v7h3.1Z" />
    </svg>
  );
}

export function ShareBar({ title, path }: { title: string; path: string }) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onPointer = (event: PointerEvent) => {
      if (!root.current?.contains(event.target as Node)) setOpen(false);
    };
    window.addEventListener("pointerdown", onPointer);
    return () => window.removeEventListener("pointerdown", onPointer);
  }, [open]);

  const url = storyAbsoluteUrl(path);
  const encoded = encodeURIComponent(url);
  const text = encodeURIComponent(title);

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  }

  async function nativeShare() {
    if (typeof navigator !== "undefined" && typeof navigator.share === "function") {
      try {
        await navigator.share({ title, url, text: title });
        setOpen(false);
      } catch {
        // User cancelled.
      }
    }
  }

  return (
    <div ref={root} className="relative">
      <button
        type="button"
        aria-label="Share this story"
        aria-expanded={open}
        onClick={(event) => {
          event.preventDefault();
          event.stopPropagation();
          setOpen((value) => !value);
        }}
        className="inline-flex h-11 items-center gap-2 text-sm text-muted transition-colors hover:text-azure"
      >
        <Share2 className="size-4" />
        Share
      </button>

      {open ? (
        <div className="absolute left-0 z-30 mt-1 w-56 rounded-md border border-border bg-surface p-2 shadow-xl">
          <p className="px-2 pb-1 font-mono text-[10px] uppercase tracking-[0.16em] text-subtle">Share</p>
          <button
            type="button"
            onClick={() => void nativeShare()}
            className="flex h-10 w-full items-center gap-3 rounded-sm px-2 text-sm text-muted hover:bg-azure/10 hover:text-azure"
          >
            <Share2 className="size-4" />
            Device share
          </button>
          <a
            href={`https://twitter.com/intent/tweet?url=${encoded}&text=${text}`}
            target="_blank"
            rel="noreferrer"
            className="flex h-10 items-center gap-3 rounded-sm px-2 text-sm text-muted hover:bg-azure/10 hover:text-azure"
          >
            <XMark />
            X
          </a>
          <a
            href={`https://t.me/share/url?url=${encoded}&text=${text}`}
            target="_blank"
            rel="noreferrer"
            className="flex h-10 items-center gap-3 rounded-sm px-2 text-sm text-muted hover:bg-azure/10 hover:text-azure"
          >
            <TelegramMark />
            Telegram
          </a>
          <a
            href={`https://wa.me/?text=${text}%20${encoded}`}
            target="_blank"
            rel="noreferrer"
            className="flex h-10 items-center gap-3 rounded-sm px-2 text-sm text-muted hover:bg-azure/10 hover:text-azure"
          >
            <WhatsAppMark />
            WhatsApp
          </a>
          <a
            href={`https://www.facebook.com/sharer/sharer.php?u=${encoded}`}
            target="_blank"
            rel="noreferrer"
            className="flex h-10 items-center gap-3 rounded-sm px-2 text-sm text-muted hover:bg-azure/10 hover:text-azure"
          >
            <FacebookMark />
            Facebook
          </a>
          <button
            type="button"
            onClick={() => void copyLink()}
            className={cn(
              "flex h-10 w-full items-center gap-3 rounded-sm px-2 text-sm hover:bg-azure/10 hover:text-azure",
              copied ? "text-azure" : "text-muted",
            )}
          >
            {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
            {copied ? "Copied" : "Copy link"}
          </button>
        </div>
      ) : null}
    </div>
  );
}
