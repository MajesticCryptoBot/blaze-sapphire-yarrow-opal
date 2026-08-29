import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-sm px-1.5 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-[0.14em]",
  {
    variants: {
      tone: {
        just: "bg-signal/15 text-signal",
        breaking: "bg-signal/15 text-signal",
        alert: "bg-warn/15 text-warn",
        new: "bg-info/15 text-info",
        mute: "bg-surface text-muted",
      },
    },
    defaultVariants: { tone: "mute" },
  },
);

export function Badge({
  className,
  tone,
  ...props
}: React.HTMLAttributes<HTMLSpanElement> & VariantProps<typeof badgeVariants>) {
  return <span className={cn(badgeVariants({ tone, className }))} {...props} />;
}
