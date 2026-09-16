const STORAGE_KEY = "asp-watch-desks";

export type WatchDesk = {
  slug: string;
  label: string;
};

const DEFAULT: WatchDesk[] = [];

export function readWatchList(): WatchDesk[] {
  if (typeof window === "undefined") return DEFAULT;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT;
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return DEFAULT;
    return parsed
      .filter((item): item is WatchDesk =>
        Boolean(item && typeof item === "object" && typeof (item as WatchDesk).slug === "string" && typeof (item as WatchDesk).label === "string"),
      )
      .slice(0, 8);
  } catch {
    return DEFAULT;
  }
}

export function writeWatchList(list: WatchDesk[]) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(list.slice(0, 8)));
    window.dispatchEvent(new CustomEvent("asp-watch-changed"));
  } catch {
    // ignore quota / private mode
  }
}

export function isWatched(slug: string, list: WatchDesk[] = readWatchList()): boolean {
  return list.some((item) => item.slug === slug);
}

export function toggleWatch(slug: string, label: string): WatchDesk[] {
  const current = readWatchList();
  const exists = current.some((item) => item.slug === slug);
  const next = exists
    ? current.filter((item) => item.slug !== slug)
    : [...current, { slug, label }].slice(0, 8);
  writeWatchList(next);
  return next;
}
