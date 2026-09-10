import { Globe2 } from "lucide-react";
import { LOCALES, useI18n, type Locale } from "@/lib/i18n";
import { useEffect, useRef, useState } from "react";

export function LanguageToggle() {
  const { locale, setLocale } = useI18n();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const current = LOCALES.find((item) => item.code === locale) || LOCALES[0];

  useEffect(() => {
    const onPointer = (event: MouseEvent) => {
      if (!ref.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onPointer);
    return () => document.removeEventListener("mousedown", onPointer);
  }, []);

  return (
    <div ref={ref} className="relative shrink-0">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-label="Select language"
        aria-expanded={open}
        className="flex h-11 items-center gap-2 rounded-md px-2.5 text-muted transition-colors hover:bg-azure/10 hover:text-azure focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-azure"
      >
        <Globe2 className="size-4" strokeWidth={1.8} />
        <span className="font-mono text-[10px] font-medium uppercase tracking-[0.08em]">{current.code === "fr-FR" ? "FR" : current.code === "zh-CN" ? "中文" : current.code.toUpperCase()}</span>
      </button>
      {open ? (
        <div className="absolute right-0 top-12 z-50 w-44 rounded-md border border-border bg-surface p-1.5 shadow-2xl">
          {LOCALES.map((item) => (
            <button
              key={item.code}
              type="button"
              onClick={() => { setLocale(item.code as Locale); setOpen(false); }}
              className={`flex w-full items-center justify-between rounded px-3 py-2.5 text-sm transition-colors ${item.code === locale ? "bg-azure/10 text-azure" : "text-muted hover:bg-elevated hover:text-foreground"}`}
            >
              <span>{item.nativeLabel}</span>
              <span className="font-mono text-[10px] uppercase text-subtle">{item.code === "fr-FR" ? "FR" : item.code === "zh-CN" ? "ZH" : item.code.toUpperCase()}</span>
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
