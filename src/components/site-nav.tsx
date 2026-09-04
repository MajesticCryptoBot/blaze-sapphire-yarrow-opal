import { Link, useRouterState } from "@tanstack/react-router";
import {
  Bitcoin,
  Building2,
  Coins,
  Home,
  Landmark,
  Lightbulb,
  Menu,
  Newspaper,
  Scale,
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
  { label: "Home", to: "/", search: {}, hash: undefined as string | undefined, icon: Home, match: "home" },
  { label: "News", to: "/", search: {}, hash: "feed", icon: Newspaper, match: "news" },
  { label: "Bitcoin", to: "/", search: { q: "bitcoin" }, hash: "feed", icon: Bitcoin, match: "bitcoin" },
  { label: "Regulation", to: "/", search: { q: "regulation" }, hash: "feed", icon: Scale, match: "regulation" },
  { label: "Altcoins", to: "/", search: { q: "altcoin" }, hash: "feed", icon: Coins, match: "altcoin" },
  { label: "US", to: "/", search: { q: "us" }, hash: "feed", icon: Landmark, match: "us" },
  { label: "China", to: "/", search: { q: "china" }, hash: "feed", icon: Building2, match: "china" },
  { label: "Fun Facts", to: "/", search: { q: "fun facts" }, hash: "feed", icon: Lightbulb, match: "fun facts" },
] as const;

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
      className="flex size-11 shrink-0 items-center justify-center rounded-md text-muted transition-colors duration-[var(--motion-quick)] hover:bg-elevated hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring md:hidden"
    >
      {open ? <X className="size-5" /> : <Menu className="size-5" />}
    </button>
  );
}

function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  const search = useRouterState({ select: (state) => state.location.search as { q?: string } });
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const hash = useRouterState({ select: (state) => state.location.hash.replace(/^#/, "") });
  const query = (search.q ?? "").trim().toLowerCase();

  return (
    <nav aria-label="Desk sections" className="flex flex-col gap-1 px-3 py-4">
      {SECTIONS.map((item) => {
        const Icon = item.icon;
        const active =
          pathname === "/" &&
          (item.match === "home"
            ? !query && hash !== "feed"
            : item.match === "news"
              ? !query && hash === "feed"
              : query === item.match);

        return (
          <Link
            key={item.label}
            to={item.to}
            search={item.search}
            hash={item.hash}
            onClick={onNavigate}
            className={cn(
              "flex h-11 items-center gap-3 rounded-md px-3 text-sm transition-colors duration-[var(--motion-quick)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              active
                ? "bg-elevated text-foreground"
                : "text-muted hover:bg-elevated hover:text-foreground",
            )}
          >
            <Icon className="size-4 shrink-0" strokeWidth={1.7} />
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
      <aside className="fixed bottom-0 left-0 top-0 z-40 hidden w-12 border-r border-border bg-bg md:block">
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Open desk navigation"
          aria-expanded={open}
          className="mt-3 ml-0.5 flex size-11 items-center justify-center rounded-md text-muted transition-colors duration-[var(--motion-quick)] hover:bg-elevated hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
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
            "absolute inset-0 bg-bg/70 transition-opacity duration-[var(--motion-fast)] ease-[var(--ease-out)]",
            open ? "opacity-100" : "opacity-0",
          )}
        />

        <aside
          aria-label="Desk navigation"
          aria-hidden={!open}
          className={cn(
            "absolute inset-y-0 left-0 flex w-[min(18rem,calc(100vw-2rem))] flex-col border-r border-border bg-surface shadow-2xl transition-transform duration-[var(--motion-fast)] ease-[var(--ease-out)]",
            open ? "translate-x-0" : "-translate-x-full",
          )}
        >
          <div className="flex h-14 items-center justify-between border-b border-border px-4">
            <div>
              <p className="font-display text-lg leading-none">ASP</p>
              <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.18em] text-subtle">
                Desk
              </p>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close desk navigation"
              className="flex size-11 items-center justify-center rounded-md text-muted transition-colors duration-[var(--motion-quick)] hover:bg-elevated hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <X className="size-4" />
            </button>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto">
            <NavLinks onNavigate={() => setOpen(false)} />
          </div>

          <div className="border-t border-border px-4 py-4">
            <SocialIconRow />
          </div>
        </aside>
      </div>
    </>
  );
}
