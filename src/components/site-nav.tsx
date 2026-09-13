import { Link, useRouterState } from "@tanstack/react-router";
import {
  CalendarDays,
  Coins,
  Cpu,
  Home,
  Lightbulb,
  Menu,
  Rocket,
  Sparkles,
  TrendingUp,
  X,
} from "lucide-react";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { SocialIconRow } from "@/lib/socials";
import { cn } from "@/lib/utils";

const SECTIONS = [
  { label: "Home", to: "/" as const, icon: Home },
  { label: "Crypto", to: "/$slug" as const, params: { slug: "crypto" }, icon: Coins },
  { label: "Tech", to: "/$slug" as const, params: { slug: "tech" }, icon: Cpu },
  { label: "AI", to: "/$slug" as const, params: { slug: "ai" }, icon: Sparkles },
  { label: "Stocks", to: "/$slug" as const, params: { slug: "stocks" }, icon: TrendingUp },
  { label: "Innovation", to: "/$slug" as const, params: { slug: "innovation" }, icon: Rocket },
  { label: "The Calendar", to: "/calendar" as const, icon: CalendarDays },
  { label: "Fun Facts", to: "/$slug" as const, params: { slug: "fun-facts" }, icon: Lightbulb },
];

type NavContextValue = {
  open: boolean;
  setOpen: (open: boolean) => void;
  toggle: () => void;
};

const NavContext = createContext<NavContextValue | null>(null);

export function SiteNavProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const toggle = useCallback(() => setOpen((value) => !value), []);
  const value = useMemo(() => ({ open, setOpen, toggle }), [open, toggle]);
  return <NavContext.Provider value={value}>{children}</NavContext.Provider>;
}

function useNav() {
  const context = useContext(NavContext);
  if (!context) throw new Error("SiteNavProvider is required");
  return context;
}

export function HeaderMenuButton() {
  const { open, toggle } = useNav();
  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={open ? "Close desk navigation" : "Open desk navigation"}
      aria-expanded={open}
      className="flex size-11 shrink-0 items-center justify-center rounded-full text-muted transition-[background-color,color] duration-[var(--motion-quick)] hover:bg-elevated hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring md:hidden"
    >
      {open ? <X className="size-5" /> : <Menu className="size-5" />}
    </button>
  );
}

function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = useRouterState({ select: (state) => state.location.pathname });

  return (
    <nav aria-label="Desk sections" className="flex flex-col gap-1 px-3 py-4">
      {SECTIONS.map((item) => {
        const Icon = item.icon;
        const href = "params" in item && item.params ? `/${item.params.slug}` : item.to;
        const active = pathname === href;
        const className = cn(
          "flex h-11 items-center gap-3 rounded-xl px-3 text-sm font-medium transition-[background-color,color] duration-[var(--motion-quick)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
          active
            ? "bg-foreground/10 text-foreground"
            : "text-muted hover:bg-foreground/5 hover:text-foreground",
        );

        if (item.to === "/") {
          return (
            <Link key={item.label} to="/" search={{ q: "" }} onClick={onNavigate} className={className}>
              <Icon className="size-[18px] shrink-0" strokeWidth={1.8} />
              <span>{item.label}</span>
            </Link>
          );
        }

        if (item.to === "/markets" || item.to === "/calendar") {
          return (
            <Link key={item.label} to={item.to} onClick={onNavigate} className={className}>
              <Icon className="size-[18px] shrink-0" strokeWidth={1.8} />
              <span>{item.label}</span>
            </Link>
          );
        }

        return (
          <Link
            key={item.label}
            to="/$slug"
            params={item.params}
            onClick={onNavigate}
            className={className}
          >
            <Icon className="size-[18px] shrink-0" strokeWidth={1.8} />
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

export function SideBar() {
  const { open, setOpen } = useNav();

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, setOpen]);

  return (
    <>
      <div className="hidden w-12 shrink-0 md:block" aria-hidden="true" />
      <aside className="fixed bottom-0 left-0 top-0 z-40 hidden w-12 border-r border-border/70 bg-bg/70 backdrop-blur-xl md:block">
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Open desk navigation"
          aria-expanded={open}
          className="mt-3 ml-0.5 flex size-11 items-center justify-center rounded-full text-muted transition-[background-color,color] duration-[var(--motion-quick)] hover:bg-elevated hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <Menu className="size-5" />
        </button>
      </aside>

      <div
        className={cn(
          "fixed inset-0 z-50",
          open ? "pointer-events-auto" : "pointer-events-none",
        )}
      >
        <button
          type="button"
          aria-label="Close desk navigation"
          onClick={() => setOpen(false)}
          className={cn(
            "absolute inset-0 bg-black/35 backdrop-blur-[2px] transition-opacity duration-[var(--motion-fast)] ease-[var(--ease-out)]",
            open ? "opacity-100" : "opacity-0",
          )}
        />

        <aside
          aria-label="Desk navigation"
          aria-hidden={!open}
          className={cn(
            "absolute inset-y-0 left-0 flex w-[min(18rem,calc(100vw-1rem))] flex-col border-r border-border/70 bg-surface/90 shadow-[var(--shadow-elevated)] backdrop-blur-2xl transition-transform duration-[var(--motion-fast)] ease-[var(--ease-out)]",
            open ? "translate-x-0" : "-translate-x-full",
          )}
        >
          <div className="flex h-16 items-center justify-between border-b border-border/70 px-4">
            <div>
              <p className="text-lg font-semibold leading-none tracking-tight">ASP</p>
              <p className="mt-1 text-[10px] font-medium uppercase tracking-[0.16em] text-subtle">
                Desk
              </p>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close desk navigation"
              className="flex size-11 items-center justify-center rounded-full text-muted transition-[background-color,color] duration-[var(--motion-quick)] hover:bg-elevated hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <X className="size-4" />
            </button>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto">
            <NavLinks onNavigate={() => setOpen(false)} />
          </div>

          <div className="border-t border-border/70 px-4 py-4">
            <SocialIconRow />
          </div>
        </aside>
      </div>
    </>
  );
}
