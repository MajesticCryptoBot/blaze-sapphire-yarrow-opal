import { useMemo, useState } from "react";
import { Search, ExternalLink, BookOpen, ArrowUpRight } from "lucide-react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { GLOSSARY, GLOSSARY_LETTERS, searchGlossary, type GlossaryCategory } from "@/lib/glossary";

export const Route = createFileRoute("/glossary")({
  component: GlossaryPage,
});

const CATEGORY_ORDER: GlossaryCategory[] = ["Macro", "Markets", "Crypto", "Trading", "DeFi", "Technology"];

function GlossaryPage() {
  const [query, setQuery] = useState("");
  const [letter, setLetter] = useState("All");

  const results = useMemo(() => {
    const searched = searchGlossary(query);
    if (letter === "All") return searched;
    return searched.filter((entry) => entry.term.toUpperCase().startsWith(letter));
  }, [query, letter]);

  const externalSearchUrl = `https://www.google.com/search?q=${encodeURIComponent(query.trim() || "financial crypto glossary")}`;

  return (
    <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:py-10">
      <div className="max-w-4xl">
        <div className="flex items-center gap-2 text-azure">
          <BookOpen className="size-5" />
          <span className="font-mono text-[11px] font-medium uppercase tracking-[0.18em]">A–Z Reference</span>
        </div>

        <h1 className="mt-3 font-display text-3xl font-medium tracking-tight sm:text-4xl">
          Crypto & Financial Glossary
        </h1>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-muted sm:text-base">
          Quickly decode the acronyms, market language and crypto terminology you meet while reading ASP News.
          Search a term, jump by letter, read the definition, then return to your story.
        </p>

        <div className="mt-7 rounded-xl border border-border bg-surface/70 p-3 shadow-sm sm:p-4">
          <label className="relative block">
            <Search className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-subtle" />
            <input
              autoFocus
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search CPI, Core CPI, FOMC, liquidity, Bitcoin, DeFi…"
              aria-label="Search the financial and crypto glossary"
              className="h-13 w-full rounded-lg border border-border bg-bg pl-12 pr-4 text-base text-foreground outline-none transition-[border-color,box-shadow] focus-visible:ring-2 focus-visible:ring-ring"
            />
          </label>

          <div className="mt-3 flex gap-1.5 overflow-x-auto pb-1" aria-label="Glossary letters">
            <LetterButton label="All" active={letter === "All"} onClick={() => setLetter("All")} />
            {GLOSSARY_LETTERS.map((item) => (
              <LetterButton key={item} label={item} active={letter === item} onClick={() => setLetter(item)} />
            ))}
          </div>
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
          <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-subtle">
            {query.trim() || letter !== "All" ? `${results.length} matching term${results.length === 1 ? "" : "s"}` : `${GLOSSARY.length} reference terms`}
          </p>
          <p className="text-xs text-muted">Definitions are concise newsroom references, not financial advice.</p>
        </div>

        {results.length > 0 ? (
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {results.map((entry) => (
              <article key={entry.term} className="rounded-lg border border-border bg-bg p-5 transition-colors hover:border-azure/50">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h2 className="font-display text-lg font-medium text-foreground">{entry.term}</h2>
                    <div className="mt-1 flex flex-wrap items-center gap-2">
                      <span className="font-mono text-[9px] uppercase tracking-[0.14em] text-azure">{entry.category}</span>
                      {entry.aliases?.slice(0, 3).map((alias) => (
                        <span key={alias} className="text-[11px] text-subtle">{alias}</span>
                      ))}
                    </div>
                  </div>
                  <span className="font-mono text-[10px] text-subtle">{entry.term[0].toUpperCase()}</span>
                </div>
                <p className="mt-3 text-sm leading-6 text-muted">{entry.definition}</p>
              </article>
            ))}
          </div>
        ) : (
          <section className="mt-6 rounded-xl border border-border bg-surface p-6 sm:p-8">
            <p className="font-display text-xl font-medium">We don't have “{query.trim()}” in the ASP glossary yet.</p>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">
              No problem. Search the web for the term, then come back here and continue reading.
            </p>
            <a
              href={externalSearchUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-5 inline-flex h-11 items-center gap-2 rounded-md border border-border bg-bg px-4 text-sm font-medium text-foreground transition-colors hover:border-azure hover:text-azure"
            >
              Search the web for “{query.trim()}”
              <ExternalLink className="size-4" />
            </a>
          </section>
        )}

        <section className="mt-10 border-t border-border pt-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-display text-lg font-medium">Still reading?</p>
              <p className="mt-1 text-sm text-muted">Return to the live news wire without losing your place.</p>
            </div>
            <Link to="/" search={{ q: "" }} className="inline-flex h-10 items-center gap-2 text-sm text-muted transition-colors hover:text-azure">
              Back to the Wire
              <ArrowUpRight className="size-4" />
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}

function LetterButton({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`flex h-8 min-w-8 shrink-0 items-center justify-center rounded-md px-2 font-mono text-[10px] uppercase transition-colors ${
        active ? "bg-azure text-white" : "border border-border bg-bg text-muted hover:border-azure hover:text-azure"
      }`}
    >
      {label}
    </button>
  );
}
