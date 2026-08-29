export function SiteFooter() {
  return (
    <footer className="mt-16 border-t border-border">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-10 sm:flex-row sm:items-end sm:justify-between sm:px-6">
        <div>
          <p className="font-display text-lg">Alpha Signals Pro</p>
          <p className="mt-1 max-w-md text-sm text-muted">
            Professional market wire for crypto, macro, and AI. Headlines are
            rewritten for the Telegram desk; this site carries the full brief.
          </p>
        </div>
        <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-subtle">
          Not investment advice · Desk copy only
        </p>
      </div>
    </footer>
  );
}
