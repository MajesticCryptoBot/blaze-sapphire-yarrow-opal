import { Link } from "@tanstack/react-router";
import { TELEGRAM_URL } from "@/lib/telegram-feed";

const X_URL = "https://x.com/aspnewschannel?s=11";

function XIcon() {
  return <span aria-hidden="true" className="font-sans text-lg font-semibold leading-none">𝕏</span>;
}

function TelegramIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="size-[18px] fill-current">
      <path d="M21.7 3.3 18.6 20c-.2 1.2-.9 1.5-1.8.9l-5-3.7-2.4 2.3c-.3.3-.5.5-1 .5l.4-5.1 9.3-8.4c.4-.4-.1-.6-.6-.2L6 13.6l-4.9-1.5c-1.1-.3-1.1-1.1.2-1.6L20.5 2c.9-.3 1.7.2 1.2 1.3Z" />
    </svg>
  );
}

// Future social integrations can be added here when the accounts exist.
const FUTURE_SOCIALS: Array<{ label: string; href: string | null }> = [
  { label: "Instagram", href: null },
  { label: "Discord", href: null },
];

export function SiteFooter() {
  return (
    <footer className="mt-16 border-t border-border">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-10 sm:flex-row sm:items-end sm:justify-between sm:px-6">
        <div>
          <p className="font-display text-lg">ASP NEWS</p>
          <p className="mt-1 max-w-md text-sm text-muted">
            Independent market intelligence for crypto, macro, and AI. Headlines
            on Telegram; full briefs on this desk.
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:items-end">
          <div className="flex items-center gap-4 text-sm text-muted">
            <Link to="/" className="hover:text-foreground">Wire</Link>
            <Link to="/markets" className="hover:text-foreground">Markets</Link>
            <a href={X_URL} target="_blank" rel="noreferrer" aria-label="ASP News on X" className="flex size-8 items-center justify-center rounded-sm hover:bg-elevated hover:text-foreground">
              <XIcon />
            </a>
            <a href={TELEGRAM_URL} target="_blank" rel="noreferrer" aria-label="ASP News on Telegram" className="flex size-8 items-center justify-center rounded-sm hover:bg-elevated hover:text-foreground">
              <TelegramIcon />
            </a>
            {FUTURE_SOCIALS.filter((social) => social.href).map((social) => (
              <a key={social.label} href={social.href!} target="_blank" rel="noreferrer" aria-label={`ASP News on ${social.label}`} className="hover:text-foreground">
                {social.label}
              </a>
            ))}
          </div>
          <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-subtle">Not investment advice</p>
        </div>
      </div>
    </footer>
  );
}
