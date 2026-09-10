import { Clock3 } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { useEffect, useRef, useState } from "react";

const ZONES = [
  { key: "newYork", zone: "America/New_York" },
  { key: "tokyo", zone: "Asia/Tokyo" },
  { key: "hongKong", zone: "Asia/Hong_Kong" },
  { key: "utc", zone: "UTC" },
] as const;

function formatClock(date: Date, zone: string) {
  return new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false, timeZone: zone }).format(date);
}

export function WorldClocks() {
  const { t } = useI18n();
  const [now, setNow] = useState(() => new Date());
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => { const id = window.setInterval(() => setNow(new Date()), 1000); return () => window.clearInterval(id); }, []);
  useEffect(() => { const close = (event: MouseEvent) => { if (!ref.current?.contains(event.target as Node)) setOpen(false); }; document.addEventListener("mousedown", close); return () => document.removeEventListener("mousedown", close); }, []);
  return (
    <div ref={ref} className="relative shrink-0">
      <button type="button" onClick={() => setOpen((value) => !value)} aria-label={t("clock.label")} aria-expanded={open} title={t("clock.label")} className="flex h-11 items-center gap-2 rounded-md px-2.5 text-muted transition-colors hover:bg-azure/10 hover:text-azure focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-azure">
        <Clock3 className="size-4" strokeWidth={1.8} />
        <span className="font-mono text-[10px] uppercase tracking-[0.08em]">UTC</span>
        <span className="hidden font-mono text-[10px] tabular-nums sm:inline">{formatClock(now, "UTC")}</span>
      </button>
      {open ? (
        <div className="absolute right-0 top-12 z-50 w-56 rounded-md border border-border bg-surface p-2 shadow-2xl">
          <div className="px-2 pb-2 font-mono text-[9px] uppercase tracking-[0.16em] text-subtle">{t("clock.label")}</div>
          {ZONES.map((item) => (
            <div key={item.key} className="flex items-center justify-between rounded px-2 py-2.5 hover:bg-elevated">
              <span className="text-sm text-muted">{t(`clock.${item.key}`)}</span>
              <span className="font-mono text-xs tabular-nums text-foreground">{formatClock(now, item.zone)}</span>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}
