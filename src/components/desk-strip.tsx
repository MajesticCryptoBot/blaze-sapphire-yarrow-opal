import { Link, useRouterState } from "@tanstack/react-router";
import { TELEGRAM_URL } from "@/lib/telegram-feed";
import { cn } from "@/lib/utils";

const ITEMS = [
  { label: "Wire", to: "/" as const },
  { label: "Markets", to: "/markets" as const },
  { label: "Bitcoin", to: "/$slug" as const, params: { slug: "bitcoin" } },
  { label: "Ethereum", to: "/$slug" as const, params: { slug: "ethereum" } },
  { label: "Solana", to: "/$slug" as const, params: { slug: "solana" } },
  { label: "XRP", to: "/$slug" as const, params: { slug: "xrp" } },
  { label: "Regulation", to: "/$slug" as const, params: { slug: "regulation" } },
  { label: "US", to: "/$slug" as const, params: { slug: "us" } },
  { label: "China", to: "/$slug" as const, params: { slug: "china" } },
  { label: "Russia", to: "/$slug" as const, params: { slug: "russia" } },
  { label: "Videos", to: "/$slug" as const, params: { slug: "videos" } },
] as const;

function itemHref(item: (typeof ITEMS)[number]) {
  if (item.to === "/") return "/";
  if (item.to === "/markets") return "/markets";
  return `/${item.params.slug}`;
}

export function DeskStrip() {
  const pathname = useRouterState({ select: (state) => state.location.pathname });

  return (
    <nav
      aria-label="Desks"
      className="desk-strip border-t border-border md:pl-14"
    >
      <div className="flex h-11 items-stretch gap-0 overflow-x-auto px-2 sm:px-3">
        {ITEMS.map((item) => {
          const href = itemHref(item);
          const active = pathname === href;
          const className = cn(
            "flex h-11 shrink-0 items-center px-3 text-[13px] tracking-wide transition-colors duration-[var(--motion-quick)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
            active
              ? "font-medium text-foreground shadow-[inset_0_-2px_0_0_currentColor]"
              : "text-muted hover:text-foreground",
          );

          if (item.to === "/") {
            return (
              <Link key={item.label} to="/" search={{ q: "" }} className={className}>
                {item.label}
              </Link>
            );
          }

          if (item.to === "/markets") {
            return (
              <Link key={item.label} to="/markets" className={className}>
                {item.label}
              </Link>
            );
          }

          return (
            <Link key={item.label} to="/$slug" params={item.params} className={className}>
              {item.label}
            </Link>
          );
        })}
        <a
          href={TELEGRAM_URL}
          target="_blank"
          rel="noreferrer"
          className="flex h-11 shrink-0 items-center px-3 text-[13px] tracking-wide text-muted hover:text-foreground"
        >
          Telegram
        </a>
      </div>
    </nav>
  );
}
