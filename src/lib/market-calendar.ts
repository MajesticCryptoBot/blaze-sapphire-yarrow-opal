export type CalendarEvent = {
  title: string;
  country: string;
  at: string;
  impact: "High" | "Medium" | "Low";
  forecast: string;
  previous: string;
};

const WATCH = /\b(cpi|ppi|pce|nfp|non-farm|nonfarm|payroll|fomc|interest rate|rate decision|gdp|unemployment|powell|jackson|fed|ecb|boj|retail sales|ism|jobless|core)\b/i;
const COUNTRIES = new Set(["USD", "EUR", "GBP", "JPY", "CNY", "CAD", "AUD", "CHF"]);

type RawEvent = {
  title?: string;
  country?: string;
  date?: string;
  impact?: string;
  forecast?: string;
  previous?: string;
};

function normalizeImpact(value: string): CalendarEvent["impact"] {
  const lower = value.toLowerCase();
  if (lower === "high" || lower === "3" || lower === "red") return "High";
  if (lower === "medium" || lower === "2" || lower === "orange") return "Medium";
  return "Low";
}

export function selectMarketEvents(raw: RawEvent[]): CalendarEvent[] {
  const cutoff = Date.now() - 6 * 60 * 60 * 1000;
  return raw
    .flatMap((row) => {
      const at = Date.parse(String(row.date ?? ""));
      if (Number.isNaN(at) || at < cutoff) return [];
      const country = String(row.country ?? "").toUpperCase();
      const title = String(row.title ?? "").trim();
      if (!title || !COUNTRIES.has(country)) return [];
      const impact = normalizeImpact(String(row.impact ?? ""));
      if (impact !== "High" && !WATCH.test(title)) return [];
      return [{
        title,
        country,
        at: new Date(at).toISOString(),
        impact,
        forecast: String(row.forecast ?? "").trim(),
        previous: String(row.previous ?? "").trim(),
      }];
    })
    .sort((a, b) => a.at.localeCompare(b.at))
    .slice(0, 40);
}

/** Official remaining 2026 prints if the live diary is unreachable. Times are UTC. */
export const FALLBACK_CALENDAR: CalendarEvent[] = [
  { title: "Consumer Price Index (CPI)", country: "USD", at: "2026-09-11T12:30:00.000Z", impact: "High", forecast: "", previous: "" },
  { title: "FOMC Rate Decision", country: "USD", at: "2026-09-16T18:00:00.000Z", impact: "High", forecast: "", previous: "" },
  { title: "Employment Situation (Nonfarm Payrolls)", country: "USD", at: "2026-10-02T12:30:00.000Z", impact: "High", forecast: "", previous: "" },
  { title: "Consumer Price Index (CPI)", country: "USD", at: "2026-10-14T12:30:00.000Z", impact: "High", forecast: "", previous: "" },
  { title: "FOMC Rate Decision", country: "USD", at: "2026-10-28T18:00:00.000Z", impact: "High", forecast: "", previous: "" },
  { title: "GDP Advance Estimate (Q3)", country: "USD", at: "2026-10-29T12:30:00.000Z", impact: "High", forecast: "", previous: "" },
  { title: "Employment Situation (Nonfarm Payrolls)", country: "USD", at: "2026-11-06T13:30:00.000Z", impact: "High", forecast: "", previous: "" },
  { title: "Consumer Price Index (CPI)", country: "USD", at: "2026-11-10T13:30:00.000Z", impact: "High", forecast: "", previous: "" },
  { title: "FOMC Rate Decision", country: "USD", at: "2026-12-09T19:00:00.000Z", impact: "High", forecast: "", previous: "" },
  { title: "Consumer Price Index (CPI)", country: "USD", at: "2026-12-10T13:30:00.000Z", impact: "High", forecast: "", previous: "" },
];

function upcomingFallback(): CalendarEvent[] {
  const cutoff = Date.now() - 6 * 60 * 60 * 1000;
  return FALLBACK_CALENDAR.filter((event) => Date.parse(event.at) > cutoff);
}

export async function fetchMarketCalendar(): Promise<CalendarEvent[]> {
  try {
    const response = await fetch("https://nfs.faireconomy.media/ff_calendar_thisweek.json", {
      cache: "no-store",
      headers: { Accept: "application/json" },
    });
    if (response.ok) {
      const payload = (await response.json()) as unknown;
      if (Array.isArray(payload)) {
        const live = selectMarketEvents(payload as RawEvent[]);
        if (live.length > 0) return live;
      }
    }
  } catch {
    // Fall through to the official-date backup list.
  }
  return upcomingFallback();
}
