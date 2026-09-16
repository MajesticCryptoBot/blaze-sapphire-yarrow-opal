import { Link, createFileRoute } from "@tanstack/react-router";
import { ArrowLeft, ChevronDown } from "lucide-react";
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

type EventGuide = {
  what: string;
  impact: string;
};

/** Brief explainers for common U.S. macro prints and their market impact. */
function guideFor(title: string): EventGuide {
  const t = title.toLowerCase();

  if (/cpi|consumer price/.test(t)) {
    return {
      what: "The Consumer Price Index measures the change in prices paid by urban consumers for a basket of goods and services. Core CPI excludes food and energy. It is the most-watched U.S. inflation gauge.",
      impact:
        "Higher-than-expected CPI often pressures risk assets (including crypto) as it raises the odds of tighter Fed policy or delayed rate cuts. Softer CPI tends to support equities, Bitcoin, and other risk assets via lower real yields and a weaker dollar.",
    };
  }
  if (/ppi|producer price/.test(t)) {
    return {
      what: "The Producer Price Index tracks selling prices received by domestic producers. It is an upstream inflation signal that can feed into consumer prices later.",
      impact:
        "Hot PPI can reinforce inflation concerns and weigh on risk assets. Cooler PPI can ease rate fears and support crypto and equities, especially when it aligns with soft CPI.",
    };
  }
  if (/pce|personal consumption/.test(t)) {
    return {
      what: "The Personal Consumption Expenditures price index is the Fed’s preferred inflation measure. Core PCE excludes food and energy and is central to FOMC communications.",
      impact:
        "Because the Fed targets PCE, surprises here move rate expectations more cleanly than CPI at times. Strong PCE can tighten financial conditions; weak PCE often lifts risk assets and crypto.",
    };
  }
  if (/nonfarm|non-farm|payroll|employment situation|nfp/.test(t)) {
    return {
      what: "Nonfarm Payrolls (the Employment Situation report) counts monthly job gains/losses in the U.S. private and public sectors, excluding farms. It also includes the unemployment rate and wage growth.",
      impact:
        "Strong payrolls and rising wages can delay rate cuts and pressure crypto via higher yields. Weak jobs data often boosts rate-cut odds and supports Bitcoin and risk assets. Wage growth is watched closely for inflation stickiness.",
    };
  }
  if (/fomc|rate decision|interest rate|federal funds/.test(t)) {
    return {
      what: "The Federal Open Market Committee sets the federal funds rate target range and publishes a statement, economic projections (quarterly), and holds a press conference with the Chair.",
      impact:
        "Rate decisions and the accompanying guidance are primary drivers of USD, yields, equities, and crypto. Dovish surprises (cuts or softer path) typically lift risk assets; hawkish holds or higher dots can trigger risk-off moves across crypto and stocks.",
    };
  }
  if (/gdp/.test(t)) {
    return {
      what: "Gross Domestic Product measures the total value of goods and services produced in the U.S. Advance, second, and final estimates revise the same quarter.",
      impact:
        "Strong GDP can support the growth narrative but also keep the Fed cautious on cuts. Weak GDP raises recession fears and can cut both ways: lower rates (supportive) vs. risk aversion (negative for crypto in the short term).",
    };
  }
  if (/unemployment|jobless claims|initial claims/.test(t)) {
    return {
      what: "Unemployment rate and jobless claims track labor-market slack. Weekly initial claims are a high-frequency signal; the unemployment rate is monthly.",
      impact:
        "Rising claims or a higher unemployment rate usually increase rate-cut odds and can support crypto. A very sharp deterioration can also trigger risk-off selling if growth fears dominate.",
    };
  }
  if (/retail sales/.test(t)) {
    return {
      what: "Retail sales measure consumer spending at retail establishments. It is a timely read on household demand, a large share of U.S. GDP.",
      impact:
        "Strong retail sales support the soft-landing / growth story and can be mixed for crypto (good for risk appetite, less urgency for cuts). Weak sales raise recession odds and can favor lower rates, which is often supportive for Bitcoin over time.",
    };
  }
  if (/ism|pmi|manufacturing|services/.test(t)) {
    return {
      what: "ISM Manufacturing and Services PMIs survey purchasing managers. Readings above 50 signal expansion; below 50 contraction. They are early-cycle growth barometers.",
      impact:
        "Strong PMIs can lift equities and risk assets; very strong ones may also keep the Fed patient. Soft PMIs increase cut odds and can support crypto if they do not signal a hard landing.",
    };
  }
  if (/powell|jackson hole|fed chair|fedspeak/.test(t)) {
    return {
      what: "Speeches by the Fed Chair or senior FOMC members often move markets when they signal the policy path, reaction function, or inflation outlook.",
      impact:
        "Hawkish tone typically strengthens the dollar and weighs on crypto and equities. Dovish or data-dependent language can ease yields and support risk assets. Markets parse every nuance around rate-cut timing.",
    };
  }
  if (/core/.test(t) && /cpi|pce|inflation/.test(t)) {
    return {
      what: "Core inflation measures exclude food and energy to capture underlying price trends that the Fed focuses on for policy.",
      impact:
        "Sticky core prints delay easing and can pressure crypto. Softening core readings increase the probability of rate cuts and are generally supportive for Bitcoin and risk assets.",
    };
  }

  return {
    what: "A scheduled U.S. macro data release or policy event that can shift expectations for growth, inflation, and Federal Reserve policy.",
    impact:
      "Surprises versus consensus often reprice interest-rate odds, the U.S. dollar, and risk appetite. Crypto tends to move with broader risk assets: softer inflation / weaker growth (without crisis) is usually supportive; hotter inflation or hawkish policy is a headwind.",
  };
}

function EventRow({ event }: { event: CalendarEvent }) {
  const [open, setOpen] = useState(false);
  const guide = useMemo(() => guideFor(event.title), [event.title]);
  const key = `${event.at}-${event.title}`;

  return (
    <div className="border-t border-border first:border-t-0">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls={`event-detail-${key}`}
        className="grid w-full gap-2 px-4 py-4 text-left transition-colors hover:bg-azure/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-azure sm:grid-cols-[7.5rem_1fr_auto]"
      >
        <div className="font-mono text-[11px] tabular-nums text-muted">
          <div>{formatStamp(event.at, "America/New_York")} NY</div>
          <div className="text-subtle">{formatStamp(event.at, "UTC")} UTC</div>
        </div>
        <div className="min-w-0">
          <p className="font-medium">{event.title}</p>
          <p className="mt-1 font-mono text-[11px] uppercase tracking-wide text-subtle">
            {event.country}
            {event.forecast ? ` · fcast ${event.forecast}` : ""}
            {event.previous ? ` · prev ${event.previous}` : ""}
          </p>
        </div>
        <div className="flex items-center gap-2 self-start">
          <span
            className={cn(
              "h-7 rounded-sm border px-2 font-mono text-[10px] uppercase tracking-wide",
              event.impact === "High"
                ? "border-signal/40 text-signal"
                : "border-border text-muted",
            )}
          >
            {event.impact}
          </span>
          <ChevronDown
            className={cn(
              "size-4 shrink-0 text-muted transition-transform duration-[var(--motion-quick)]",
              open && "rotate-180",
            )}
          />
        </div>
      </button>

      {open ? (
        <div
          id={`event-detail-${key}`}
          className="border-t border-border/60 bg-surface/50 px-4 py-4 sm:pl-[calc(7.5rem+1rem)]"
        >
          <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-subtle">What it is</p>
          <p className="mt-1.5 max-w-2xl font-news text-[15px] leading-[1.6] text-muted">{guide.what}</p>
          <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.16em] text-subtle">
            Impact on crypto &amp; markets
          </p>
          <p className="mt-1.5 max-w-2xl font-news text-[15px] leading-[1.6] text-muted">{guide.impact}</p>
        </div>
      ) : null}
    </div>
  );
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
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-subtle">Week ahead · US only</p>
        <h1 className="mt-3 font-display text-4xl font-medium sm:text-5xl">The Calendar</h1>
        <p className="mt-4 font-news text-lg leading-[1.6] text-muted">
          High-impact U.S. prints that move crypto and risk — CPI, payrolls, FOMC, and GDP.
          Date and hour shown in 24-hour format (New York and UTC). Tap any event for a short
          explainer and market impact.
        </p>
      </header>

      {events === null ? (
        <p className="mt-10 font-news text-base text-muted">Loading the week ahead…</p>
      ) : error && events.length === 0 ? (
        <p className="mt-10 font-news text-base text-muted">The calendar is temporarily unavailable.</p>
      ) : grouped.length === 0 ? (
        <p className="mt-10 font-news text-base text-muted">No major U.S. prints remain on this week’s tape.</p>
      ) : (
        <div className="mt-8 space-y-10">
          {grouped.map(([day, rows]) => (
            <section key={day}>
              <h2 className="font-display text-2xl">{day}</h2>
              <div className="mt-4 overflow-hidden rounded-lg border border-border">
                {rows.map((event) => (
                  <EventRow key={`${event.at}-${event.title}`} event={event} />
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </main>
  );
}
