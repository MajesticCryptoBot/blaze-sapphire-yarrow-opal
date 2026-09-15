import { Link, useNavigate } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { useState, type FormEvent } from "react";
import { HeaderMenuButton } from "@/components/site-nav";
import { DeskStrip } from "@/components/desk-strip";
import { ThemeToggle } from "@/components/theme";
import { WorldClocks } from "@/components/world-clocks";

export function SiteHeader() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");

  function submitSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const value = query.trim();
    void navigate({ to: "/", search: value ? { q: value } : {}, hash: "feed" });
  }

  return (
    <header className="relative sticky top-0 z-40 border-b border-border/70 bg-bg">
      {/*
        Safari 26 samples the sticky/fixed element's solid background for
        browser chrome tinting. backdrop-filter on the SAME element blocks
        sampling and leaves the top dark. Glass lives on this inner layer.
      */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-bg/80 backdrop-blur-xl backdrop-saturate-150 supports-[backdrop-filter]:bg-bg/65"
      />
      <div className="relative">
        <div className="flex items-center gap-2 px-3 py-2.5 sm:gap-3 sm:px-5 md:pl-14">
          <HeaderMenuButton />

          <Link
            to="/"
            search={{ q: "" }}
            className="flex min-h-11 min-w-0 items-center gap-3 rounded-md outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <img
              src="/asplogo.jpg"
              alt="ASP News"
              className="size-9 shrink-0 rounded-full object-cover"
            />
            <span className="leading-tight">
              <span className="block text-[17px] font-semibold tracking-[-0.01em] text-foreground">
                ASP News
              </span>
              <span className="hidden text-[10px] font-medium uppercase tracking-[0.16em] text-muted sm:block">
                Market intelligence
              </span>
            </span>
          </Link>

          <form
            onSubmit={submitSearch}
            className="ml-auto w-full max-w-32 sm:max-w-52 md:max-w-64 lg:max-w-72"
          >
            <label className="relative block">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-subtle" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search"
                aria-label="Search articles, markets, and desk sections"
                className="h-11 w-full rounded-xl border border-border/80 bg-surface/80 pl-9 pr-3 text-sm text-foreground outline-none transition-[border-color,box-shadow,background-color] duration-[var(--motion-quick)] placeholder:text-subtle focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30"
              />
            </label>
          </form>

          <ThemeToggle />
        </div>
        <DeskStrip />
        <WorldClocks />
      </div>
    </header>
  );
}
