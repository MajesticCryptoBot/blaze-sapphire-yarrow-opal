import { Badge } from "@/components/ui/badge";
import type { NewsTag } from "@/lib/news";

const TONE = {
  "JUST IN": "just",
  BREAKING: "breaking",
  ALERT: "alert",
  NEW: "new",
} as const;

export function TagBadge({ tag }: { tag: NewsTag }) {
  return <Badge tone={TONE[tag]}>{tag}</Badge>;
}
