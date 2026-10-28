import type { MarketQuote } from "@/lib/binance-markets";

/** Short desk-style note for why a name is moving. Heuristic, not a live catalyst feed. */
export function whyItMoved(quote: MarketQuote): string {
  const pct = quote.change24h;
  const abs = Math.abs(pct);
  const up = pct > 0;
  const name = quote.symbol;

  if (abs < 0.15) {
    return "Flat on the session — no clear catalyst on the tape.";
  }

  if (quote.group === "bstock") {
    if (abs >= 5) {
      return up
        ? `${name} bStock leading the equity-linked tape on strong risk appetite.`
        : `${name} bStock under pressure as equity risk is sold.`;
    }
    if (abs >= 2) {
      return up
        ? `${name} tracking a constructive session in the underlying equity complex.`
        : `${name} softer with the broader equity-linked complex.`;
    }
    return up
      ? `${name} edging higher with listed risk assets.`
      : `${name} modestly lower with equity risk.`;
  }

  // Crypto majors
  if (name === "BTC") {
    if (abs >= 4) {
      return up
        ? "Bitcoin ripping — risk-on flow and/or macro relief typically behind moves of this size."
        : "Bitcoin selling off — risk-off tone or firmer yields often drive declines this large.";
    }
    if (abs >= 2) {
      return up
        ? "BTC firm — constructive for the broader crypto complex when majors lead."
        : "BTC soft — majors under pressure tends to weigh on alts as well.";
    }
    return up ? "BTC modestly higher on the day." : "BTC modestly lower on the day.";
  }

  if (name === "ETH") {
    if (abs >= 4) {
      return up
        ? "Ether outperforming — beta to crypto risk and L2/activity narratives often amplify ETH."
        : "Ether lagging — high-beta crypto risk is being cut.";
    }
    return up ? "ETH higher with the majors." : "ETH lower with the majors.";
  }

  if (name === "SOL") {
    if (abs >= 5) {
      return up
        ? "Solana leading alts — high-beta names tend to stretch when crypto risk is bid."
        : "Solana under pressure — high-beta alts usually lead on the way down too.";
    }
    return up ? "SOL firm versus the broader alt tape." : "SOL soft on the session.";
  }

  if (name === "XRP") {
    return up
      ? "XRP bid — legal and liquidity headlines often dominate this name."
      : "XRP offered — flows and legal-tape sensitivity cut both ways.";
  }

  if (name === "BNB") {
    return up
      ? "BNB higher — exchange-token beta to volume and BNB Chain activity."
      : "BNB softer with exchange-linked risk.";
  }

  if (abs >= 5) {
    return up
      ? `${name} among the strongest on the board — elevated beta to the crypto session.`
      : `${name} among the weakest on the board — elevated beta to risk-off flow.`;
  }
  if (abs >= 2) {
    return up
      ? `${name} advancing with the session leaders.`
      : `${name} declining with the session laggards.`;
  }
  return up ? `${name} modestly higher.` : `${name} modestly lower.`;
}
