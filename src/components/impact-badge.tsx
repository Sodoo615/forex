"use client";

import type { Impact } from "@/lib/types";
import { cn, IMPACT_STYLES } from "@/lib/utils";
import { useLang } from "@/lib/i18n/language-context";

export default function ImpactBadge({ impact }: { impact: Impact }) {
  const { t } = useLang();
  const style = IMPACT_STYLES[impact];
  return (
    <span
      className={cn(
        "inline-flex items-center rounded px-1.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide",
        style.className
      )}
    >
      {t.impacts[impact]}
    </span>
  );
}
