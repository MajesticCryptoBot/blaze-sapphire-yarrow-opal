import { Link, useNavigate } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { useEffect, useState, type FormEvent } from "react";
import { HeaderMenuButton } from "@/components/site-nav";
import { TELEGRAM_URL } from "@/lib/telegram-feed";

export function SiteHeader() {
  const navigate = useNavigate();
  const [now, setNow] = useState(() => new Date());
  const [query, setQuery] = useState("");

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

  function submitSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const value = query.trim();
    void navigate({ to: "/", search: value ? { q: value } : {}, hash: "feed" });
  }

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-bg/92 backdrop-blur-sm">
      <div className="flex items-center gap-3 px-3 py-2.5 sm:px-5 md:pl-14">
        <HeaderMenuButton />

        <Link to="/" className="flex min-h-11 min-w-0 items-center gap-3">
          <span className="flex size-8 shrink-0 items-center justify-center rounded-sm bg-primary font-display text-sm font-semibold text-primary-foreground">
            A
          </span>
          <span className="leading-tight">
            <span className="block font-display text-[17px] font-medium tracking-tight">
              Alpha Signals Pro
            </span>
            <span className="hidden font-mono text-[10px] uppercase tracking-[0.18em] text-muted sm:block">
              Market intelligence
            </span>
          </span>
        </Link>

        <nav className="hidden items-center lg:flex">
          <Link to="/" className="flex h-11 items-center px-3 text-sm text-muted hover:text-foreground">
            Wire
          </Link>
          <Link to="/markets" className="flex h-11 items-center px-3 text-sm text-muted hover:text-foreground">
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

        <form onSubmit={submitSearch} className="ml-auto w-full max-w-32 sm:max-w-52 md:max-w-64 lg:max-w-72">
          <label className="relative block">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-subtle" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search desk"
              aria-label="Search articles, markets, and desk sections"
              className="h-11 w-full rounded-md border border-border bg-surface pl-9 pr-3 text-sm text-foreground outline-none placeholder:text-subtle transition-[border-color,box-shadow] duration-[var(--motion-quick)] focus-visible:ring-2 focus-visible:ring-ring"
            />
          </label>
        </form>

        <div className="hidden text-right xl:block">
          <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-subtle">UTC</div>
          <div className="font-mono text-[11px] tabular-nums text-muted">{stamp}</div>
        </div>
      </div>
    </header>
  );
}
