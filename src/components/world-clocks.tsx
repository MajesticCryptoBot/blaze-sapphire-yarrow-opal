import { useEffect, useState } from "react";

const ZONES = [
  { id: "ny", label: "New York", tz: "America/New_York", session: "nyse" as const },
  { id: "tyo", label: "Tokyo", tz: "Asia/Tokyo", session: "tse" as const },
  { id: "hk", label: "Hong Kong", tz: "Asia/Hong_Kong", session: "hkex" as const },
  { id: "utc", label: "UTC", tz: "UTC", session: null },
];

function partsInZone(now: Date, timeZone: string) {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone,
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    hourCycle: "h23",
  }).formatToParts(now);

  const get = (type: string) => parts.find((part) => part.type === type)?.value ?? "";
  return {
    weekday: get("weekday"),
    hour: Number(get("hour")),
    minute: Number(get("minute")),
    clock: `${get("hour")}:${get("minute")}`,
  };
}

function sessionOpen(kind: "nyse" | "hkex" | "tse" | null, weekday: string, hour: number, minute: number) {
  if (!kind) return null;
  const weekend = weekday === "Sat" || weekday === "Sun";
  if (weekend) return false;
  const mins = hour * 60 + minute;
  if (kind === "nyse") return mins >= 9 * 60 + 30 && mins < 16 * 60;
  if (kind === "hkex") return mins >= 9 * 60 + 30 && mins < 16 * 60;
  return mins >= 9 * 60 && mins < 15 * 60;
}

export function WorldClocks() {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <div className="border-t border-border md:pl-14">
      <div className="flex h-10 items-center gap-0 overflow-x-auto px-2 sm:px-3">
        {ZONES.map((zone) => {
          const stamp = partsInZone(now, zone.tz);
          const open = sessionOpen(zone.session, stamp.weekday, stamp.hour, stamp.minute);
          return (
            <div
              key={zone.id}
              className="flex h-10 shrink-0 items-center gap-2 px-3 font-mono text-[11px] tabular-nums"
            >
              <span className="uppercase tracking-[0.14em] text-subtle">{zone.label}</span>
              <span className="text-foreground">{stamp.clock}</span>
              {open == null ? null : (
                <span className={open ? "text-up" : "text-subtle"}>{open ? "Open" : "Closed"}</span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
