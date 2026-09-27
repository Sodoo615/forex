import type { Impact } from "@/lib/types";
import { cn, IMPACT_STYLES } from "@/lib/utils";

export default function ImpactBadge({ impact }: { impact: Impact }) {
  const style = IMPACT_STYLES[impact];
  return (
    <span
      className={cn(
        "inline-flex items-center rounded px-1.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide",
        style.className
      )}
    >
      {style.label}
    </span>
  );
}
