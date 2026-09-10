import { Check, Copy, Globe2, MessageCircle, Send, Share2 } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { useEffect, useRef, useState } from "react";

type ShareMenuProps = { url: string; title: string };
export function ShareMenu({ url, title }: ShareMenuProps) {
  const { t } = useI18n(); const [open, setOpen] = useState(false); const [copied, setCopied] = useState(false); const ref = useRef<HTMLDivElement>(null);
  useEffect(() => { const close = (event: MouseEvent) => { if (!ref.current?.contains(event.target as Node)) setOpen(false); }; document.addEventListener("mousedown", close); return () => document.removeEventListener("mousedown", close); }, []);
  const encodedUrl = encodeURIComponent(url); const encodedTitle = encodeURIComponent(title);
  const links = [
    { label: t("share.telegram"), icon: Send, href: `https://t.me/share/url?url=${encodedUrl}&text=${encodedTitle}` },
    { label: t("share.whatsapp"), icon: MessageCircle, href: `https://wa.me/?text=${encodeURIComponent(`${title} ${url}`)}` },
    { label: t("share.facebook"), icon: Globe2, href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}` },
    { label: t("share.x"), icon: Share2, href: `https://x.com/intent/post?text=${encodedTitle}&url=${encodedUrl}` },
  ];
  async function copyLink() { try { await navigator.clipboard.writeText(url); setCopied(true); window.setTimeout(() => setCopied(false), 1600); } catch {} }
  return <div ref={ref} className="relative"><button type="button" onClick={() => setOpen((value) => !value)} aria-label={t("share.label")} aria-expanded={open} className="inline-flex h-9 items-center gap-2 rounded-md px-2.5 text-xs text-muted transition-colors hover:bg-azure/10 hover:text-azure focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-azure"><Share2 className="size-3.5" strokeWidth={1.8} /><span>{t("share.label")}</span></button>{open ? <div className="absolute bottom-11 left-0 z-50 w-48 rounded-md border border-border bg-surface p-1.5 shadow-2xl"><div className="px-2 pb-1.5 pt-1 font-mono text-[9px] uppercase tracking-[0.14em] text-subtle">{t("share.shareOn")}</div>{links.map(({ label, icon: Icon, href }) => <a key={label} href={href} target="_blank" rel="noreferrer" onClick={() => setOpen(false)} className="flex items-center gap-3 rounded px-2.5 py-2.5 text-sm text-muted transition-colors hover:bg-elevated hover:text-foreground"><Icon className="size-4" strokeWidth={1.7} />{label}</a>)}<button type="button" onClick={() => void copyLink()} className="flex w-full items-center gap-3 rounded px-2.5 py-2.5 text-left text-sm text-muted transition-colors hover:bg-elevated hover:text-foreground">{copied ? <Check className="size-4" /> : <Copy className="size-4" strokeWidth={1.7} />}{copied ? t("share.copied") : t("share.copy")}</button></div> : null}</div>;
}
