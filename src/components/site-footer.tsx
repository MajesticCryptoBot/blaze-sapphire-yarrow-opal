import { Link } from "@tanstack/react-router";
import { TELEGRAM_URL } from "@/lib/telegram-feed";

export function SiteFooter() {
  return (
    <footer className="mt-16 border-t border-border">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-10 sm:flex-row sm:items-end sm:justify-between sm:px-6">
        <div>
          <p className="font-display text-lg">Alpha Signals Pro</p>
          <p className="mt-1 max-w-md text-sm text-muted">
            Independent market intelligence for crypto, macro, and AI. Headlines
            on Telegram; full briefs on this desk.
          </p>
        </div>
        <div className="flex flex-col gap-2 sm:items-end">
          <div className="flex gap-4 text-sm text-muted">
            <Link to="/" className="hover:text-foreground">Wire</Link>
            <Link to="/markets" className="hover:text-foreground">Markets</Link>
            <a href={TELEGRAM_URL} target="_blank" rel="noreferrer" className="hover:text-foreground">
              Telegram
            </a>
          </div>
          <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-subtle">
            Not investment advice
          </p>
        </div>
      </div>
    </footer>
  );
}
