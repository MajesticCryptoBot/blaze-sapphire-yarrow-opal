import type { ReactNode } from "react";

export type SocialLink = {
  id: string;
  label: string;
  href: string | null;
  icon: () => ReactNode;
};

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

export const SOCIAL_LINKS: SocialLink[] = [
  { id: "x", label: "X", href: "https://x.com/aspnewschannel?s=11", icon: XMark },
  { id: "telegram", label: "Telegram", href: "https://t.me/AlphaSignalsPro", icon: TelegramMark },
  { id: "instagram", label: "Instagram", href: null, icon: () => null },
  { id: "discord", label: "Discord", href: null, icon: () => null },
];

export const LIVE_SOCIALS = SOCIAL_LINKS.filter((item) => item.href);

export function SocialIconRow({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-1 ${className}`}>
      {LIVE_SOCIALS.map((item) => {
        const Icon = item.icon;
        return (
          <a
            key={item.id}
            href={item.href!}
            target="_blank"
            rel="noreferrer"
            aria-label={`ASP News on ${item.label}`}
            className="flex size-11 items-center justify-center rounded-md text-muted transition-colors duration-[var(--motion-quick)] hover:bg-elevated hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <Icon />
          </a>
        );
      })}
    </div>
  );
}
