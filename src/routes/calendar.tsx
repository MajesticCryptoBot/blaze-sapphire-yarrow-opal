import { Link, createFileRoute } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { type CalendarEvent } from "@/lib/market-calendar";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/calendar")({
  head: () => ({ meta: [{ title: "The Calendar — ASP News" }] }),
  component: CalendarPage,
});

function formatStamp(iso: string, timeZone: string) {
  return new Date(iso).toLocaleString("en-GB", {
    timeZone,
    weekday: "short",
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

function CalendarPage() {
  const [events, setEvents] = useState<CalendarEvent[] | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    let active = true;
    const load = async () => {
      try {
        const response = await fetch("/api/market-calendar", { cache: "no-store" });
        if (!response.ok) throw new Error("calendar failed");
        const payload = (await response.json()) as { data?: CalendarEvent[] };
        if (active) setEvents(payload.data ?? []);
      } catch {
        if (active) {
          setEvents([]);
          setError(true);
        }
      }
    };
    void load();
    return () => {
      active = false;
    };
  }, []);

  const grouped = useMemo(() => {
    const map = new Map<string, CalendarEvent[]>();
    for (const event of events ?? []) {
      const key = new Date(event.at).toLocaleDateString("en-GB", {
        timeZone: "America/New_York",
        weekday: "long",
        day: "2-digit",
        month: "long",
      });
      const list = map.get(key) ?? [];
      list.push(event);
      map.set(key, list);
    }
    return [...map.entries()];
  }, [events]);

  return (
    <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
      <Link
        to="/"
        search={{ q: "" }}
        className="inline-flex h-11 items-center gap-2 text-sm text-muted transition-colors hover:text-azure"
      >
        <ArrowLeft className="size-4" />
        Back
      </Link>

      <header className="mt-6 max-w-3xl border-b border-border pb-8">
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-subtle">Week ahead</p>
        <h1 className="mt-3 font-display text-4xl font-medium sm:text-5xl">The Calendar</h1>
        <p className="mt-4 font-news text-lg leading-[1.6] text-muted">
          High-impact prints that move crypto and risk — CPI, payrolls, FOMC, and GDP.
          Times are New York and UTC. Sourced from the live macro diary, with official
          Fed and BLS dates as backup.
        </p>
      </header>

      {events === null ? (
        <p className="mt-10 font-news text-base text-muted">Loading the week ahead…</p>
      ) : error && events.length === 0 ? (
        <p className="mt-10 font-news text-base text-muted">The calendar is temporarily unavailable.</p>
      ) : grouped.length === 0 ? (
        <p className="mt-10 font-news text-base text-muted">No major prints remain on this week’s tape.</p>
      ) : (
        <div className="mt-8 space-y-10">
          {grouped.map(([day, rows]) => (
            <section key={day}>
              <h2 className="font-display text-2xl">{day}</h2>
              <div className="mt-4 overflow-hidden rounded-lg border border-border">
                {rows.map((event) => (
                  <div key={`${event.at}-${event.title}`} className="grid gap-2 border-t border-border px-4 py-4 first:border-t-0 sm:grid-cols-[7.5rem_1fr_auto]">
                    <div className="font-mono text-[11px] tabular-nums text-muted">
                      <div>{formatStamp(event.at, "America/New_York")} NY</div>
                      <div className="text-subtle">{formatStamp(event.at, "UTC")} UTC</div>
                    </div>
                    <div>
                      <p className="font-medium">{event.title}</p>
                      <p className="mt-1 font-mono text-[11px] uppercase tracking-wide text-subtle">
                        {event.country}
                        {event.forecast ? ` · fcast ${event.forecast}` : ""}
                        {event.previous ? ` · prev ${event.previous}` : ""}
                      </p>
                    </div>
                    <span
                      className={cn(
                        "h-7 self-start rounded-sm border px-2 font-mono text-[10px] uppercase tracking-wide",
                        event.impact === "High"
                          ? "border-signal/40 text-signal"
                          : "border-border text-muted",
                      )}
                    >
                      {event.impact}
                    </span>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </main>
  );
}
