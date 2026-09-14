import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";

export type Language = "en" | "fr";

const STORAGE_KEY = "asp-language";

const FR: Record<string, string> = {
  "Market intelligence": "Intelligence de marché",
  "Search": "Rechercher",
  "Search articles, markets, and desk sections": "Rechercher des articles, marchés et rubriques",
  "Switch to dark mode": "Passer au mode sombre",
  "Switch to light mode": "Passer au mode clair",
  "Wire": "Fil d'actualité",
  "Markets": "Marchés",
  "Bitcoin": "Bitcoin",
  "Ethereum": "Ethereum",
  "Solana": "Solana",
  "Regulation": "Régulation",
  "Videos": "Vidéos",
  "A–Z Glossary": "Glossaire A–Z",
  "Desks": "Rubriques",
  "Open": "Ouvert",
  "Closed": "Fermé",
  "Live market intelligence": "Intelligence de marché en direct",
  "The brief behind the headline.": "L'essentiel derrière le titre.",
  "Alpha Signals Pro covers crypto, macro, and AI as it hits the tape. Headlines move first on Telegram. This desk holds the full brief.": "Alpha Signals Pro couvre la crypto, la macroéconomie et l'IA au fil de l'actualité. Les titres arrivent d'abord sur Telegram. Cette plateforme rassemble l'essentiel.",
  "Search the wire": "Rechercher dans le fil",
  "All": "Tout",
  "No stories match that filter.": "Aucune actualité ne correspond à ce filtre.",
  "Loading the wire…": "Chargement du fil…",
  "The desk": "La rédaction",
  "Built for the open tape": "Conçu pour l'actualité en temps réel",
  "Every story on this site is the same copy that hits the Alpha Signals Pro channel — expanded so you can read, share, and keep a permanent link. Nothing here is a trade recommendation.": "Chaque article publié ici reprend le même contenu que celui diffusé sur le canal Alpha Signals Pro — développé pour être lu, partagé et conservé via un lien permanent. Rien ici ne constitue une recommandation de trading.",
  "Open Telegram": "Ouvrir Telegram",
  "View markets": "Voir les marchés",
  "Independent market intelligence for crypto, macro, and AI. Headlines on Telegram; full briefs on this desk.": "Intelligence de marché indépendante sur la crypto, la macroéconomie et l'IA. Titres sur Telegram ; analyses complètes sur cette plateforme.",
  "Channel": "Canal",
  "Not investment advice": "Pas un conseil en investissement",
  "Spot tape": "Marché spot",
  "Live Binance quotes, refreshed every five seconds, for majors, alts, and bStocks.": "Cours Binance en direct, actualisés toutes les cinq secondes, pour les principales cryptos, les altcoins et les bStocks.",
  "Symbol": "Symbole",
  "Name": "Nom",
  "24h": "24 h",
  "Last": "Dernier cours",
  "Change": "Variation",
  "Updated": "Actualisé",
  "Loading the tape…": "Chargement du marché…",
  "The tape is temporarily unavailable. Please try again shortly.": "Le marché est temporairement indisponible. Veuillez réessayer dans quelques instants.",
  "Week ahead": "Semaine à venir",
  "The Calendar": "Le calendrier",
  "Back": "Retour",
  "High-impact prints that move crypto and risk — CPI, payrolls, FOMC, and GDP. Times are New York and UTC. Sourced from the live macro diary, with official Fed and BLS dates as backup.": "Les publications majeures qui font bouger la crypto et les actifs risqués — IPC, emploi, FOMC et PIB. Horaires indiqués à New York et en UTC. Données issues du calendrier macro en direct, avec les dates officielles de la Fed et du BLS en référence.",
  "Loading the week ahead…": "Chargement de la semaine à venir…",
  "The calendar is temporarily unavailable.": "Le calendrier est temporairement indisponible.",
  "No major prints remain on this week’s tape.": "Aucune publication majeure ne reste au programme cette semaine.",
  "fcast": "prévision",
  "prev": "précédent",
  "Crypto & Financial Glossary": "Glossaire crypto et financier",
  "Search a financial or crypto term…": "Rechercher un terme financier ou crypto…",
  "Search the financial and crypto glossary": "Rechercher dans le glossaire financier et crypto",
  "Matching terms": "Termes correspondants",
  "is not currently in the ASP glossary.": "n'est actuellement pas présent dans le glossaire ASP.",
  "Search the web for": "Rechercher sur le Web",
  "Back to the Wire": "Retour au fil d'actualité",
  "This desk is not on the roster.": "Cette rubrique n'est pas disponible.",
  "Sourced notebook": "Carnet documenté",
  "These notes are taken from primary Bitcoin literature — the white paper, the Nakamoto Institute archive, Cambridge’s CBECI, and the SEC — not from recap blogs.": "Ces notes proviennent de sources primaires sur Bitcoin — le livre blanc, les archives du Nakamoto Institute, le CBECI de Cambridge et la SEC — et non de blogs de synthèse.",
  "From the tape": "Dans le fil",
  "Loading this desk…": "Chargement de cette rubrique…",
  "No matching briefs on this desk yet.": "Aucune actualité correspondante dans cette rubrique pour le moment.",
  "Share this story": "Partager cet article",
  "Share": "Partager",
  "Share this brief": "Partager cette analyse",
  "Share via…": "Partager via…",
  "Copied": "Copié",
  "Copy link": "Copier le lien",
  "Original source": "Source originale",
  "View on Telegram →": "Voir sur Telegram →",
  "News": "Actualités",
  "Newsroom": "Rédaction",
  "The full ASP tape — every brief, photo, and video as it hits the desk.": "Tout le fil ASP — chaque analyse, photo et vidéo dès son arrivée sur la plateforme.",
  "Crypto desk": "Rubrique crypto",
  "Bitcoin, ether, alts, ETFs, whales, and the digital-asset tape.": "Bitcoin, ether, altcoins, ETF, baleines et actualité des actifs numériques.",
  "Tech desk": "Rubrique tech",
  "Apple, Microsoft, Nvidia, and the rest of big-tech corporate tape.": "Apple, Microsoft, Nvidia et l'actualité des grandes entreprises technologiques.",
  "AI desk": "Rubrique IA",
  "Models, labs, and new artificial-intelligence features as they ship.": "Modèles, laboratoires et nouvelles fonctionnalités d'intelligence artificielle.",
  "Stocks": "Actions",
  "Equities desk": "Rubrique actions",
  "Earnings, listings, indexes, and the cash equity tape — not crypto tokens.": "Résultats, introductions, indices et marchés actions — hors tokens crypto.",
  "Lab notes": "Notes de laboratoire",
  "Future ideas, prototypes, and breakthroughs — not routine product news.": "Idées d'avenir, prototypes et avancées majeures — au-delà de l'actualité produit courante.",
  "Bitcoin desk": "Rubrique Bitcoin",
  "BTC, ETF flows, miners, treasuries, and the monetary debate around Bitcoin.": "BTC, flux des ETF, mineurs, trésoreries et débat monétaire autour de Bitcoin.",
  "Ethereum desk": "Rubrique Ethereum",
  "Ether, the L2 stack, staking, and Ethereum market structure.": "Ether, écosystème L2, staking et structure du marché Ethereum.",
  "Solana desk": "Rubrique Solana",
  "SOL, Solana apps, validators, and network events.": "SOL, applications Solana, validateurs et événements du réseau.",
  "XRP desk": "Rubrique XRP",
  "Ripple, XRP liquidity, and the legal tape around the token.": "Ripple, liquidité XRP et actualité juridique autour du token.",
  "Policy desk": "Rubrique politique",
  "SEC, CFTC, ETFs, lawsuits, and market-structure rules.": "SEC, CFTC, ETF, procès et règles de structure de marché.",
  "Altcoins": "Altcoins",
  "Altcoin desk": "Rubrique altcoins",
  "Ethereum, Solana, XRP, and the rest of the tape outside Bitcoin.": "Ethereum, Solana, XRP et le reste du marché hors Bitcoin.",
  "United States": "États-Unis",
  "The Fed, Treasury, Washington, and U.S. macro that moves risk assets.": "Fed, Trésor, Washington et données macro américaines qui font bouger les actifs risqués.",
  "World desk": "Rubrique monde",
  "Non-U.S. briefs from the tape — Europe, Asia, and the rest of the world.": "Actualités hors États-Unis — Europe, Asie et reste du monde.",
  "China desk": "Rubrique Chine",
  "Beijing policy, Chinese markets, and the China-crypto corridor.": "Politique de Pékin, marchés chinois et corridor Chine-crypto.",
  "Russia desk": "Rubrique Russie",
  "Moscow, the ruble, and Russia-related market and crypto briefs.": "Moscou, rouble et actualité des marchés et de la crypto liés à la Russie.",
  "Fun Facts": "Infos insolites",
  "Notebook": "Carnet",
  "Fun facts": "Infos insolites",
  "Short, sourced notes on Bitcoin and crypto history — not trading calls.": "Courtes notes sourcées sur Bitcoin et l'histoire de la crypto — pas de signaux de trading.",
  "Video desk": "Rubrique vidéo",
  "Every brief on the tape that arrived with video.": "Toutes les actualités du fil accompagnées d'une vidéo.",
  "Passer au français": "Passer au français",
  "Switch to English": "Passer à l'anglais",
};

type LanguageContextValue = {
  language: Language;
  setLanguage: (language: Language) => void;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

function applyLanguage(language: Language) {
  document.documentElement.lang = language;
  document.documentElement.dataset.language = language;
}

export function readStoredLanguage(): Language {
  try {
    return localStorage.getItem(STORAGE_KEY) === "fr" ? "fr" : "en";
  } catch {
    return "en";
  }
}

export function translatedSection(slug: string, field: "label" | "kicker" | "headline" | "dek", value: string) {
  const map: Record<string, Partial<Record<typeof field, string>>> = {
    news: { label: "Actualités", kicker: "Rédaction", headline: "Actualités", dek: "Tout le fil ASP — chaque analyse, photo et vidéo dès son arrivée sur la plateforme." },
    crypto: { kicker: "Rubrique crypto", headline: "Crypto", dek: "Bitcoin, ether, altcoins, ETF, baleines et actualité des actifs numériques." },
    tech: { kicker: "Rubrique tech", headline: "Tech", dek: "Apple, Microsoft, Nvidia et l'actualité des grandes entreprises technologiques." },
    ai: { kicker: "Rubrique IA", headline: "IA", dek: "Modèles, laboratoires et nouvelles fonctionnalités d'intelligence artificielle." },
    stocks: { label: "Actions", kicker: "Rubrique actions", headline: "Actions", dek: "Résultats, introductions, indices et marchés actions — hors tokens crypto." },
    innovation: { kicker: "Notes de laboratoire", headline: "Innovation", dek: "Idées d'avenir, prototypes et avancées majeures — au-delà de l'actualité produit courante." },
    bitcoin: { kicker: "Rubrique Bitcoin", headline: "Bitcoin", dek: "BTC, flux des ETF, mineurs, trésoreries et débat monétaire autour de Bitcoin." },
    ethereum: { kicker: "Rubrique Ethereum", headline: "Ethereum", dek: "Ether, écosystème L2, staking et structure du marché Ethereum." },
    solana: { kicker: "Rubrique Solana", headline: "Solana", dek: "SOL, applications Solana, validateurs et événements du réseau." },
    xrp: { kicker: "Rubrique XRP", headline: "XRP", dek: "Ripple, liquidité XRP et actualité juridique autour du token." },
    regulation: { label: "Régulation", kicker: "Rubrique politique", headline: "Régulation", dek: "SEC, CFTC, ETF, procès et règles de structure de marché." },
    altcoins: { label: "Altcoins", kicker: "Rubrique altcoins", headline: "Altcoins", dek: "Ethereum, Solana, XRP et le reste du marché hors Bitcoin." },
    us: { label: "États-Unis", kicker: "États-Unis", headline: "États-Unis", dek: "Fed, Trésor, Washington et données macro américaines qui font bouger les actifs risqués." },
    international: { kicker: "Rubrique monde", headline: "International", dek: "Actualités hors États-Unis — Europe, Asie et reste du monde." },
    china: { kicker: "Rubrique Chine", headline: "Chine", dek: "Politique de Pékin, marchés chinois et corridor Chine-crypto." },
    russia: { kicker: "Rubrique Russie", headline: "Russie", dek: "Moscou, rouble et actualité des marchés et de la crypto liés à la Russie." },
    "fun-facts": { label: "Infos insolites", kicker: "Carnet", headline: "Infos insolites", dek: "Courtes notes sourcées sur Bitcoin et l'histoire de la crypto — pas de signaux de trading." },
    videos: { label: "Vidéos", kicker: "Rubrique vidéo", headline: "Vidéos", dek: "Toutes les actualités du fil accompagnées d'une vidéo." },
  };
  return map[slug]?.[field] ?? value;
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>("en");
  const languageRef = useRef<Language>("en");
  const translating = useRef(false);
  const originalText = useRef(new WeakMap<Text, string>());
  const originalAttributes = useRef(new WeakMap<HTMLElement, Map<string, string>>());

  const setLanguage = useCallback((next: Language) => {
    languageRef.current = next;
    setLanguageState(next);
    try { localStorage.setItem(STORAGE_KEY, next); } catch { /* Ignore blocked storage. */ }
    applyLanguage(next);
    window.requestAnimationFrame(() => window.dispatchEvent(new Event("asp-language-change")));
  }, []);

  useEffect(() => {
    const next = readStoredLanguage();
    languageRef.current = next;
    setLanguageState(next);
    applyLanguage(next);

    const translate = () => {
      if (translating.current) return;
      translating.current = true;
      try {
        const language = languageRef.current;
        const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
        let node: Node | null;
        while ((node = walker.nextNode())) {
          const textNode = node as Text;
          const parent = textNode.parentElement;
          if (!parent || ["SCRIPT", "STYLE", "NOSCRIPT"].includes(parent.tagName)) continue;
          const current = textNode.nodeValue ?? "";
          if (!originalText.current.has(textNode)) originalText.current.set(textNode, current);
          const original = originalText.current.get(textNode) ?? current;
          const trimmed = original.trim();
          if (!trimmed) continue;
          const translated = language === "fr" ? FR[trimmed] : undefined;
          textNode.nodeValue = current.replace(current.trim(), translated ?? trimmed);
        }

        document.querySelectorAll<HTMLElement>("[placeholder], [aria-label], [title]").forEach((el) => {
          let attrs = originalAttributes.current.get(el);
          if (!attrs) {
            attrs = new Map();
            originalAttributes.current.set(el, attrs);
          }
          for (const attr of ["placeholder", "aria-label", "title"]) {
            const current = el.getAttribute(attr);
            if (current !== null && !attrs.has(attr)) attrs.set(attr, current);
            const original = attrs.get(attr);
            if (original !== undefined) el.setAttribute(attr, language === "fr" ? FR[original] ?? original : original);
          }
        });
      } finally {
        translating.current = false;
      }
    };

    const observer = new MutationObserver(() => window.requestAnimationFrame(translate));
    observer.observe(document.body, { childList: true, subtree: true, characterData: true, attributes: true, attributeFilter: ["placeholder", "aria-label", "title"] });
    window.requestAnimationFrame(translate);
    return () => observer.disconnect();
  }, []);

  const value = useMemo(() => ({ language, setLanguage }), [language, setLanguage]);
  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) throw new Error("useLanguage must be used inside LanguageProvider");
  return context;
}

export function LanguageToggle() {
  const { language, setLanguage } = useLanguage();
  const next = language === "en" ? "fr" : "en";
  return (
    <button
      type="button"
      onClick={() => setLanguage(next)}
      aria-label={language === "en" ? "Passer au français" : "Switch to English"}
      title={language === "en" ? "Passer au français" : "Switch to English"}
      className="flex h-11 min-w-11 shrink-0 items-center justify-center rounded-md px-2 text-[11px] font-semibold tracking-wide text-muted transition-colors duration-[var(--motion-quick)] hover:bg-azure/10 hover:text-azure focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-azure"
    >
      {language === "en" ? "FR" : "EN"}
    </button>
  );
}
