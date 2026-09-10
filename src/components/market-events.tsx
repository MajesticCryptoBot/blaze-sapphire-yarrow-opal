import { CalendarDays, ExternalLink } from "lucide-react";
import { useI18n } from "@/lib/i18n";

const EVENTS = [
  { date: "2026-09-11T08:30:00-04:00", key: "cpi", titleKey: "events.cpi", source: "BLS", url: "https://www.bls.gov/cpi/" },
  { date: "2026-09-15T14:00:00-04:00", key: "fomc", titleKey: "events.fomc", source: "Federal Reserve", url: "https://www.federalreserve.gov/monetarypolicy/fomccalendars.htm" },
  { date: "2026-09-16T14:30:00-04:00", key: "fomc", titleKey: "events.fomc", source: "Federal Reserve", url: "https://www.federalreserve.gov/monetarypolicy/fomccalendars.htm" },
  { date: "2026-10-02T08:30:00-04:00", key: "jobs", titleKey: "events.jobs", source: "BLS", url: "https://www.bls.gov/schedule/news_release/empsit.htm" },
  { date: "2026-10-14T08:30:00-04:00", key: "cpi", titleKey: "events.cpi", source: "BLS", url: "https://www.bls.gov/schedule/news_release/cpi.htm" },
  { date: "2026-10-27T14:00:00-04:00", key: "fomc", titleKey: "events.fomc", source: "Federal Reserve", url: "https://www.federalreserve.gov/monetarypolicy/fomccalendars.htm" },
  { date: "2026-10-28T14:30:00-04:00", key: "fomc", titleKey: "events.fomc", source: "Federal Reserve", url: "https://www.federalreserve.gov/monetarypolicy/fomccalendars.htm" },
  { date: "2026-11-06T08:30:00-05:00", key: "jobs", titleKey: "events.jobs", source: "BLS", url: "https://www.bls.gov/schedule/news_release/empsit.htm" },
  { date: "2026-11-10T08:30:00-05:00", key: "cpi", titleKey: "events.cpi", source: "BLS", url: "https://www.bls.gov/schedule/news_release/cpi.htm" },
  { date: "2026-12-04T08:30:00-05:00", key: "jobs", titleKey: "events.jobs", source: "BLS", url: "https://www.bls.gov/schedule/news_release/empsit.htm" },
  { date: "2026-12-08T14:00:00-05:00", key: "fomc", titleKey: "events.fomc", source: "Federal Reserve", url: "https://www.federalreserve.gov/monetarypolicy/fomccalendars.htm" },
  { date: "2026-12-09T14:30:00-05:00", key: "fomc", titleKey: "events.fomc", source: "Federal Reserve", url: "https://www.federalreserve.gov/monetarypolicy/fomccalendars.htm" },
  { date: "2026-12-10T08:30:00-05:00", key: "cpi", titleKey: "events.cpi", source: "BLS", url: "https://www.bls.gov/schedule/news_release/cpi.htm" },
];

export function MarketEvents() {
  const { t, locale } = useI18n();
  const now = Date.now();
  const upcoming = EVENTS.filter((event) => new Date(event.date).getTime() > now).slice(0, 8);
  const dateFormatter = new Intl.DateTimeFormat(locale, { weekday: "short", day: "2-digit", month: "short", timeZone: "America/New_York" });
  const timeFormatter = new Intl.DateTimeFormat(locale, { hour: "2-digit", minute: "2-digit", timeZone: "America/New_York" });
  return (
    <section className="mt-8 rounded-lg border border-border bg-surface p-5 sm:p-6">
      <div className="flex items-start gap-3 border-b border-border pb-4">
        <CalendarDays className="mt-0.5 size-4 text-azure" />
        <div><p className="font-mono text-[10px] uppercase tracking-[0.18em] text-subtle">{t("events.kicker")}</p><h2 className="mt-1 font-display text-2xl">{t("events.title")}</h2><p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">{t("events.dek")}</p></div>
      </div>
      <div className="divide-y divide-border">
        {upcoming.map((event) => (
          <div key={`${event.date}-${event.key}`} className="grid gap-3 py-4 sm:grid-cols-[120px_1fr_auto] sm:items-center">
            <div><div className="font-mono text-xs tabular-nums text-foreground">{dateFormatter.format(new Date(event.date))}</div><div className="mt-1 font-mono text-[10px] uppercase tracking-wide text-subtle">{timeFormatter.format(new Date(event.date))} ET</div></div>
            <div><div className="text-sm font-medium text-foreground">{t(event.titleKey)}</div><div className="mt-1 text-xs text-muted">{event.source}</div></div>
            <a href={event.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-xs text-primary hover:text-azure"><span>{t("events.source")}</span><ExternalLink className="size-3" /></a>
          </div>
        ))}
      </div>
    </section>
  );
}
