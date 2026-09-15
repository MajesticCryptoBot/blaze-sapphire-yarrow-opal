import { Moon, Sun } from "lucide-react";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type ThemeName = "dark" | "light";

const STORAGE_KEY = "asp-theme";

const LIGHT_VARS: Record<string, string> = {
  "--color-bg": "#f5f5f7",
  "--color-surface": "#ffffff",
  "--color-elevated": "#f2f2f7",
  "--color-foreground": "#1d1d1f",
  "--color-muted": "#6e6e73",
  "--color-subtle": "#86868b",
  "--color-border": "#d2d2d7",
  "--color-primary": "#1d1d1f",
  "--color-primary-foreground": "#ffffff",
  "--color-ring": "#0071e3",
  "--color-signal": "#d70015",
  "--color-signal-foreground": "#ffffff",
  "--color-warn": "#9a6700",
  "--color-info": "#0071e3",
  "--color-up": "#248a3d",
  "--color-down": "#d70015",
  "--color-azure": "#0071e3",
  "--chrome-fill": "rgba(255, 255, 255, 0.72)",
  "--chrome-drawer": "rgba(255, 255, 255, 0.86)",
  "--chrome-line": "rgba(0, 0, 0, 0.08)",
  "--search-fill": "rgba(0, 0, 0, 0.05)",
};

type ThemeContextValue = {
  theme: ThemeName;
  toggle: () => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

function setMeta(name: string, content: string) {
  const node = document.querySelector(`meta[name="${name}"]`);
  if (node) node.setAttribute("content", content);
}

function applyVars(theme: ThemeName) {
  const root = document.documentElement;
  if (theme === "light") {
    for (const [name, value] of Object.entries(LIGHT_VARS)) {
      root.style.setProperty(name, value);
    }
    root.style.backgroundColor = "#f5f5f7";
  } else {
    for (const name of Object.keys(LIGHT_VARS)) {
      root.style.removeProperty(name);
    }
    root.style.backgroundColor = "#0b0b0d";
  }
}

function applyTheme(theme: ThemeName) {
  const root = document.documentElement;
  root.dataset.theme = theme;
  root.style.colorScheme = theme;
  applyVars(theme);
  setMeta("theme-color", theme === "light" ? "#f5f5f7" : "#0b0b0d");
  setMeta("color-scheme", theme);
  setMeta("apple-mobile-web-app-status-bar-style", theme === "light" ? "default" : "black-translucent");

  // iOS Safari freezes sticky/fixed backdrop layers across theme changes.
  const chrome = document.querySelectorAll<HTMLElement>(".site-chrome, .site-rail, .site-drawer");
  chrome.forEach((node) => {
    node.style.setProperty("-webkit-backdrop-filter", "none");
    node.style.setProperty("backdrop-filter", "none");
  });
  void root.offsetHeight;
  chrome.forEach((node) => {
    node.style.removeProperty("-webkit-backdrop-filter");
    node.style.removeProperty("backdrop-filter");
  });
}

export function readStoredTheme(): ThemeName {
  try {
    const value = localStorage.getItem(STORAGE_KEY);
    if (value === "light" || value === "dark") return value;
  } catch {
    // Ignore blocked storage.
  }
  return "dark";
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<ThemeName>("dark");

  useEffect(() => {
    const next = readStoredTheme();
    setTheme(next);
    applyTheme(next);
  }, []);

  const toggle = useCallback(() => {
    setTheme((current) => {
      const next = current === "dark" ? "light" : "dark";
      try {
        localStorage.setItem(STORAGE_KEY, next);
      } catch {
        // Ignore blocked storage.
      }
      applyTheme(next);
      return next;
    });
  }, []);

  const value = useMemo(() => ({ theme, toggle }), [theme, toggle]);
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function ThemeToggle() {
  const context = useContext(ThemeContext);
  if (!context) return null;
  const { theme, toggle } = context;
  const next = theme === "dark" ? "light" : "dark";

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={`Switch to ${next} mode`}
      title={`Switch to ${next} mode`}
      className="flex size-11 shrink-0 items-center justify-center rounded-md text-muted transition-colors duration-[var(--motion-quick)] hover:bg-azure/10 hover:text-azure focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-azure"
    >
      {theme === "dark" ? <Sun className="size-4" strokeWidth={1.8} /> : <Moon className="size-4" strokeWidth={1.8} />}
    </button>
  );
}
