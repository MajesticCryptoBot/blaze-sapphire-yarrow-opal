import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { TELEGRAM_URL } from "@/lib/telegram-feed";

export function SiteHeader() {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const stamp = now.toLocaleString("en-GB", {
    weekday: "short",
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    timeZone: "UTC",
    hour12: false,
  });

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-bg/92 backdrop-blur-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <Link to="/" className="flex min-h-11 items-center gap-3">
          <span className="flex size-8 items-center justify-center rounded-sm bg-primary font-display text-sm font-semibold text-primary-foreground">
            A
          </span>
          <span className="leading-tight">
            <span className="block font-display text-[17px] font-medium tracking-tight">
              Alpha Signals Pro
            </span>
            <span className="block font-mono text-[10px] uppercase tracking-[0.18em] text-muted">
              Market intelligence
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          <Link
            to="/"
            className="flex h-11 items-center px-3 text-sm text-muted hover:text-foreground"
          >
            Wire
          </Link>
          <Link
            to="/markets"
            className="flex h-11 items-center px-3 text-sm text-muted hover:text-foreground"
          >
            Markets
          </Link>
          <a
            href={TELEGRAM_URL}
            target="_blank"
            rel="noreferrer"
            className="flex h-11 items-center px-3 text-sm text-muted hover:text-foreground"
          >
            Telegram
          </a>
        </nav>

        <div className="hidden text-right sm:block">
          <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-subtle">
            UTC
          </div>
          <div className="font-mono text-[11px] tabular-nums text-muted">{stamp}</div>
        </div>
      </div>
    </header>
  );
}
