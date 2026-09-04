import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  ArrowRight,
  Bitcoin,
  BookOpen,
  Globe2,
  Home,
  Menu,
  Newspaper,
  Scale,
  Sparkles,
  X as CloseIcon,
} from "lucide-react";

const X_URL = "https://x.com/aspnewschannel?s=11";
const TELEGRAM_URL = "https://t.me/AlphaSignalsPro";

const sections = [
  { label: "Home", q: "", icon: Home },
  { label: "News", q: "", icon: Newspaper },
  { label: "Bitcoin", q: "bitcoin", icon: Bitcoin },
  { label: "Regulation", q: "regulation", icon: Scale },
  { label: "Altcoins", q: "altcoin", icon: Sparkles },
  { label: "US", q: "us", icon: Globe2 },
  { label: "China", q: "china", icon: Globe2 },
  { label: "Fun Facts", q: "fun facts", icon: BookOpen },
] as const;

function XIcon() {
  return (
    <span
      aria-hidden="true"
      className="font-sans text-[17px] font-semibold leading-none"
    >
      𝕏
    </span>
  );
}

function TelegramIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="size-[17px] fill-current"
    >
      <path d="M21.7 3.3 18.6 20c-.2 1.2-.9 1.5-1.8.9l-5-3.7-2.4 2.3c-.3.3-.5.5-1 .5l.4-5.1 9.3-8.4c.4-.4-.1-.6-.6-.2L6 13.6l-4.9-1.5c-1.1-.3-1.1-1.1.2-1.6L20.5 2c.9-.3 1.7.2 1.2 1.3Z" />
    </svg>
  );
}

export function SideBar() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open]);

  return (
    <>
      {open && (
        <button
          type="button"
          aria-label="Close site navigation"
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-40 cursor-default bg-black/20 backdrop-blur-[1px] md:bg-transparent md:backdrop-blur-none"
        />
      )}

      <aside
        aria-label="Site navigation"
        className={`fixed z-50 transition-[left,bottom,transform] duration-200 ease-out ${
          open
            ? "left-4 bottom-4 md:left-5 md:top-1/2 md:bottom-auto md:-translate-y-1/2"
            : "left-4 bottom-4 md:left-5 md:top-1/2 md:bottom-auto md:-translate-y-1/2"
        }`}
      >
        <div
          className={`overflow-hidden border border-border/90 bg-surface/98 shadow-2xl shadow-black/40 backdrop-blur-md transition-[width,height,max-height] duration-200 ${
            open
              ? "w-[min(280px,calc(100vw-32px))] rounded-xl"
              : "w-11 rounded-xl"
          }`}
        >
          <div
            className={`flex items-center border-b border-border ${
              open ? "h-12 justify-between px-3" : "h-11 justify-center"
            }`}
          >
            <button
              type="button"
              onClick={() => setOpen((value) => !value)}
              aria-label={open ? "Close site navigation" : "Open site navigation"}
              aria-expanded={open}
              className={`flex items-center justify-center rounded-lg text-muted transition-colors hover:bg-elevated hover:text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring ${
                open ? "size-8" : "size-9"
              }`}
            >
              {open ? <CloseIcon className="size-[17px]" /> : <Menu className="size-[18px]" />}
            </button>

            {open && (
              <div className="pr-1">
                <div className="font-mono text-[10px] font-semibold tracking-[0.22em] text-foreground">
                  ASP
                </div>
                <div className="font-mono text-[8px] uppercase tracking-[0.16em] text-subtle">
                  Desk navigation
                </div>
              </div>
            )}
          </div>

          {open && (
            <>
              <nav
                aria-label="Site sections"
                className="max-h-[62vh] overflow-y-auto py-2 [scrollbar-width:thin]"
              >
                {sections.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.label}
                      to="/"
                      search={item.q ? { q: item.q } : {}}
                      onClick={() => setOpen(false)}
                      className="group flex h-10 items-center gap-3 px-3 text-[13px] text-muted transition-colors hover:bg-elevated hover:text-foreground focus-visible:bg-elevated focus-visible:text-foreground focus-visible:outline-none"
                    >
                      <Icon className="size-[16px] shrink-0 text-subtle transition-colors group-hover:text-foreground" strokeWidth={1.7} />
                      <span className="flex-1">{item.label}</span>
                      <ArrowRight className="size-3.5 -translate-x-1 text-subtle opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100" />
                    </Link>
                  );
                })}
              </nav>

              <div className="border-t border-border px-3 py-3">
                <div className="mb-2 px-1 font-mono text-[8px] uppercase tracking-[0.18em] text-subtle">
                  Follow the desk
                </div>
                <div className="flex items-center gap-1">
                  <a
                    href={X_URL}
                    target="_blank"
                    rel="noreferrer"
                    aria-label="ASP News on X"
                    className="flex size-9 items-center justify-center rounded-lg text-muted transition-colors hover:bg-elevated hover:text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  >
                    <XIcon />
                  </a>
                  <a
                    href={TELEGRAM_URL}
                    target="_blank"
                    rel="noreferrer"
                    aria-label="ASP News on Telegram"
                    className="flex size-9 items-center justify-center rounded-lg text-muted transition-colors hover:bg-elevated hover:text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  >
                    <TelegramIcon />
                  </a>
                </div>
              </div>
            </>
          )}
        </div>
      </aside>
    </>
  );
}
