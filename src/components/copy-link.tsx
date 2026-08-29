import { Check, Link2 } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export function CopyLink({ path, label = "Copy article link" }: { path: string; label?: string }) {
  const [done, setDone] = useState(false);

  async function copy() {
    const url = `${window.location.origin}${path}`;
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      const el = document.createElement("textarea");
      el.value = url;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
    }
    setDone(true);
    window.setTimeout(() => setDone(false), 1800);
  }

  return (
    <Button type="button" variant="outline" size="sm" onClick={copy}>
      {done ? <Check className="size-3.5" /> : <Link2 className="size-3.5" />}
      {done ? "Copied" : label}
    </Button>
  );
}
