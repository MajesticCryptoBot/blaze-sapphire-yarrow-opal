import { Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import type { CalendarEvent } from "@/lib/market-calendar";

function formatCountdown(ms: number) {
  if (ms <= 0) return "now";
  const totalMin = Math.floor(ms / 60_000);
  const days = Math.floor(totalMin / (60 * 24));
  const hours = Math.floor((totalMin % (60 * 24)) / 60);
  const mins = totalMin % 60;
  if (days > 0) return `${days}d ${hours}h`;
  if (hours > 0) return `${hours}h ${mins}m`;
  return `${mins}m`;
}

function formatNy(iso: string) {
  return new Date(iso).toLocaleString("en-GB", {
    timeZone: "America/New_York",
    weekday: "short",
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

export function EventCountdown() {
  const [next, setNext] = useState<CalendarEvent | null>(null);
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    let active = true;
    const load = async () => {
      try {
        const response = await fetch("/api/market-calendar", { cache: "no-store" });
        if (!response.ok) return;
        const payload = (await response.json()) as { data?: CalendarEvent[] };
        const rows = payload.data ?? [];
        const upcoming = rows
          .filter((e) => Date.parse(e.at) > Date.now() - 5 * 60_000)
          .sort((a, b) => a.at.localeCompare(b.at));
        if (active) setNext(upcoming[0] ?? null);
      } catch {
        if (active) setNext(null);
      }
    };
    void load();
    const refresh = window.setInterval(load, 15 * 60_000);
    const tick = window.setInterval(() => setNow(Date.now()), 30_000);
    return () => {
      active = false;
      window.clearInterval(refresh);
      window.clearInterval(tick);
    };
  }, []);

  const remaining = useMemo(() => {
    if (!next) return null;
    return Date.parse(next.at) - now;
  }, [next, now]);

  if (!next || remaining === null) return null;

  return (
    <div className="border-b border-border bg-surface/80">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-3 gap-y-1 px-4 py-2 text-[12px] sm:px-6 md:pl-14">
        <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-subtle">Next print</span>
        <span className="font-medium text-foreground">{next.title}</span>
        <span className="font-mono tabular-nums text-muted">
          {formatNy(next.at)} NY · in {formatCountdown(remaining)}
        </span>
        {next.impact === "High" ? (
          <span className="rounded-sm border border-signal/40 px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-wide text-signal">
            High
          </span>
        ) : null}
        <Link
          to="/calendar"
          className="ml-auto text-[12px] font-medium text-azure hover:underline"
        >
          Full calendar →
        </Link>
      </div>
    </div>
  );
}
