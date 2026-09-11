import { useMemo, useState } from "react";
import { Search, ExternalLink, ArrowLeft } from "lucide-react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { searchGlossary } from "@/lib/glossary";

export const Route = createFileRoute("/glossary")({
  component: GlossaryPage,
});

function GlossaryPage() {
  const [query, setQuery] = useState("");

  const results = useMemo(() => searchGlossary(query), [query]);
  const trimmedQuery = query.trim();
  const exactMatch = trimmedQuery
    ? results.find((entry) =>
        [entry.term, ...(entry.aliases ?? [])].some(
          (value) => value.toLowerCase() === trimmedQuery.toLowerCase(),
        ),
      )
    : null;

  const externalSearchUrl = `https://www.google.com/search?q=${encodeURIComponent(trimmedQuery || "financial crypto glossary")}`;

  return (
    <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:py-14">
      <div className="max-w-3xl">
        <h1 className="font-display text-3xl font-medium tracking-tight sm:text-4xl">
          Crypto & Financial Glossary
        </h1>

        <div className="mt-7">
          <label className="relative block">
            <Search className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-azure" />
            <input
              autoFocus
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search a financial or crypto term…"
              aria-label="Search the financial and crypto glossary"
              className="h-14 w-full rounded-md border border-border bg-bg pl-12 pr-4 text-base text-foreground outline-none transition-[border-color,box-shadow] duration-200 placeholder:text-subtle focus:border-azure focus-visible:ring-2 focus-visible:ring-azure/30"
            />
          </label>
        </div>

        {trimmedQuery ? (
          <div className="mt-6">
            {exactMatch ? (
              <article className="border-t border-border pt-5">
                <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                  <h2 className="font-display text-2xl font-medium text-foreground">
                    {exactMatch.term}
                  </h2>
                  <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-azure">
                    {exactMatch.category}
                  </span>
                </div>
                <p className="mt-3 max-w-2xl text-base leading-7 text-muted">
                  {exactMatch.definition}
                </p>
              </article>
            ) : results.length > 0 ? (
              <section className="border-t border-border pt-5">
                <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-subtle">
                  Matching terms
                </p>
                <div className="mt-4 space-y-5">
                  {results.slice(0, 8).map((entry) => (
                    <article key={entry.term}>
                      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                        <h2 className="font-display text-xl font-medium text-foreground">
                          {entry.term}
                        </h2>
                        <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-azure">
                          {entry.category}
                        </span>
                      </div>
                      <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">
                        {entry.definition}
                      </p>
                    </article>
                  ))}
                </div>
              </section>
            ) : (
              <section className="border-t border-border pt-5">
                <p className="text-base text-foreground">
                  “{trimmedQuery}” is not currently in the ASP glossary.
                </p>
                <a
                  href={externalSearchUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-3 inline-flex items-center gap-2 text-sm text-azure transition-colors hover:underline"
                >
                  Search the web for “{trimmedQuery}"
                  <ExternalLink className="size-4" />
                </a>
              </section>
            )}
          </div>
        ) : null}

        <div className="mt-14 border-t border-border pt-5">
          <Link
            to="/"
            search={{ q: "" }}
            className="inline-flex items-center gap-2 text-sm text-muted transition-colors hover:text-azure"
          >
            <ArrowLeft className="size-4" />
            Back to the Wire
          </Link>
        </div>
      </div>
    </main>
  );
}
