import { Link, useRouterState } from "@tanstack/react-router";
import { Bitcoin, CalendarDays, Cpu, Home, Lightbulb, Menu, Sparkles, TrendingUp, X } from "lucide-react";
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { LanguageToggle } from "@/components/language-toggle";
import { SocialIconRow } from "@/lib/socials";
import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";

const SECTIONS = [
  { key: "home", to: "/" as const, icon: Home },
  { key: "crypto", to: "/$slug" as const, params: { slug: "crypto" }, icon: Bitcoin },
  { key: "tech", to: "/$slug" as const, params: { slug: "tech" }, icon: Cpu },
  { key: "ai", to: "/$slug" as const, params: { slug: "ai" }, icon: Sparkles },
  { key: "stocks", to: "/$slug" as const, params: { slug: "stocks" }, icon: TrendingUp },
  { key: "innovation", to: "/$slug" as const, params: { slug: "innovation" }, icon: Lightbulb },
  { key: "events", to: "/$slug" as const, params: { slug: "next-events" }, icon: CalendarDays },
  { key: "funFacts", to: "/$slug" as const, params: { slug: "fun-facts" }, icon: Lightbulb },
];

type NavContextValue = { open: boolean; setOpen: (open: boolean) => void; toggle: () => void };
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
  const { t } = useI18n();
  return <button type="button" onClick={toggle} aria-label={open ? t("nav.close") : t("nav.open")} aria-expanded={open} className="flex size-11 shrink-0 items-center justify-center rounded-md text-muted transition-colors duration-[var(--motion-quick)] hover:bg-elevated hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring md:hidden">{open ? <X className="size-5" /> : <Menu className="size-5" />}</button>;
}

function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const { t } = useI18n();
  return <nav aria-label={t("nav.aria")} className="flex flex-col gap-1 px-3 py-4">{SECTIONS.map((item) => { const Icon = item.icon; const href = "params" in item && item.params ? `/${item.params.slug}` : item.to; const active = pathname === href; const className = cn("flex h-11 items-center gap-3 rounded-md px-3 text-sm transition-colors duration-[var(--motion-quick)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-azure", active ? "bg-azure/10 text-azure" : "text-muted hover:bg-azure/10 hover:text-azure"); const label = t(`nav.${item.key}`); if (item.to === "/") return <Link key={item.key} to="/" search={{ q: "" }} onClick={onNavigate} className={className}><Icon className="size-4 shrink-0" strokeWidth={1.7} /><span>{label}</span></Link>; return <Link key={item.key} to="/$slug" params={item.params} onClick={onNavigate} className={className}><Icon className="size-4 shrink-0" strokeWidth={1.7} /><span>{label}</span></Link>; })}</nav>;
}

export function SideBar() {
  const { open, setOpen } = useNav();
  const { t } = useI18n();
  useEffect(() => { if (!open) return; const onKey = (event: KeyboardEvent) => { if (event.key === "Escape") setOpen(false); }; const previous = document.body.style.overflow; document.body.style.overflow = "hidden"; window.addEventListener("keydown", onKey); return () => { document.body.style.overflow = previous; window.removeEventListener("keydown", onKey); }; }, [open, setOpen]);
  return <><div className="hidden w-12 shrink-0 md:block" aria-hidden="true" /><aside className="fixed bottom-0 left-0 top-0 z-40 hidden w-12 border-r border-border bg-bg md:block"><button type="button" onClick={() => setOpen(true)} aria-label={t("nav.open")} aria-expanded={open} className="mt-3 ml-0.5 flex size-11 items-center justify-center rounded-md text-muted transition-colors duration-[var(--motion-quick)] hover:bg-elevated hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"><Menu className="size-5" /></button></aside><div className={cn("fixed inset-0 z-50", open ? "pointer-events-auto" : "pointer-events-none")}><button type="button" aria-label={t("nav.close")} onClick={() => setOpen(false)} className={cn("absolute inset-0 bg-bg/70 transition-opacity duration-[var(--motion-fast)] ease-[var(--ease-out)]", open ? "opacity-100" : "opacity-0")} /><aside aria-label={t("nav.aria")} aria-hidden={!open} className={cn("absolute inset-y-0 left-0 flex w-[min(18rem,calc(100vw-2rem))] flex-col border-r border-border bg-surface shadow-2xl transition-transform duration-[var(--motion-fast)] ease-[var(--ease-out)]", open ? "translate-x-0" : "-translate-x-full")}><div className="flex h-14 items-center justify-between border-b border-border px-4"><div><p className="font-display text-lg leading-none">ASP</p><p className="mt-1 font-mono text-[10px] uppercase tracking-[0.18em] text-subtle">{t("nav.desk")}</p></div><button type="button" onClick={() => setOpen(false)} aria-label={t("nav.close")} className="flex size-11 items-center justify-center rounded-md text-muted transition-colors duration-[var(--motion-quick)] hover:bg-elevated hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"><X className="size-4" /></button></div><div className="min-h-0 flex-1 overflow-y-auto"><NavLinks onNavigate={() => setOpen(false)} /></div><div className="border-t border-border px-4 py-4"><SocialIconRow /><div className="mt-3 md:hidden"><LanguageToggle /></div></div></aside></div></>;
}
