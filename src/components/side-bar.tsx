import { Link } from "@tanstack/react-router";
import { useState } from "react";

const X_URL = "https://x.com/aspnewschannel?s=11";
const TELEGRAM_URL = "https://t.me/AlphaSignalsPro";

const sections = [
  { label: "Home", q: "" },
  { label: "News", q: "" },
  { label: "Bitcoin", q: "bitcoin" },
  { label: "Regulation", q: "regulation" },
  { label: "Altcoins", q: "altcoin" },
  { label: "US", q: "us" },
  { label: "China", q: "china" },
  { label: "Fun Facts", q: "fun facts" },
] as const;

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

export function SideBar() {
  const [open, setOpen] = useState(false);

  return (
    <aside className="fixed left-0 top-1/2 z-50 -translate-y-1/2">
      <div className={`flex flex-col overflow-hidden rounded-r-md border border-border bg-surface/95 shadow-xl backdrop-blur transition-all duration-200 ${open ? "w-48" : "w-10"}`}>
        <button type="button" onClick={() => setOpen((value) => !value)} aria-label={open ? "Close site navigation" : "Open site navigation"} aria-expanded={open} className="flex h-10 shrink-0 items-center justify-center border-b border-border text-primary hover:bg-elevated">
          <span className="font-mono text-xs font-semibold tracking-widest">ASP</span>
        </button>
        <nav aria-label="Site sections" className="py-1">
          {sections.map((item) => (
            <Link key={item.label} to="/" search={item.q ? { q: item.q } : {}} onClick={() => setOpen(false)} className={`flex h-10 items-center whitespace-nowrap px-3 text-sm text-muted transition-colors hover:bg-elevated hover:text-foreground ${open ? "" : "pointer-events-none"}`} tabIndex={open ? 0 : -1}>
              <span className="w-4 shrink-0 text-center text-[10px] text-subtle">•</span>
              <span className="ml-2">{item.label}</span>
            </Link>
          ))}
        </nav>
        <div className="border-t border-border py-2">
          <div className="flex items-center justify-center gap-3 px-2">
            <a href={X_URL} target="_blank" rel="noreferrer" aria-label="ASP News on X" className="flex size-8 items-center justify-center rounded-sm text-muted hover:bg-elevated hover:text-foreground"><XIcon /></a>
            <a href={TELEGRAM_URL} target="_blank" rel="noreferrer" aria-label="ASP News on Telegram" className="flex size-8 items-center justify-center rounded-sm text-muted hover:bg-elevated hover:text-foreground"><TelegramIcon /></a>
          </div>
        </div>
      </div>
    </aside>
  );
}
