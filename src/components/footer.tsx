"use client";

import Link from "next/link";
import { TrendingUp } from "lucide-react";
import { useLang } from "@/lib/i18n/language-context";

export default function Footer() {
  const { t } = useLang();
  return (
    <footer className="border-t border-border bg-surface">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="mb-3 flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-md bg-brand text-white">
              <TrendingUp size={15} strokeWidth={2.5} />
            </span>
            <span className="font-bold">
              Forex<span className="text-brand">News</span>
            </span>
          </div>
          <p className="text-sm text-muted">{t.footer.tagline}</p>
        </div>
        <div>
          <h3 className="mb-3 text-sm font-semibold">{t.footer.product}</h3>
          <ul className="space-y-2 text-sm text-muted">
            <li><Link href="/calendar" className="hover:text-foreground">{t.footer.economicCalendar}</Link></li>
            <li><Link href="/news" className="hover:text-foreground">{t.footer.forexNews}</Link></li>
            <li><Link href="/markets" className="hover:text-foreground">{t.footer.marketOverview}</Link></li>
            <li><Link href="/currencies" className="hover:text-foreground">{t.footer.currencies}</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="mb-3 text-sm font-semibold">{t.footer.resources}</h3>
          <ul className="space-y-2 text-sm text-muted">
            <li><Link href="/news" className="hover:text-foreground">{t.footer.marketAnalysis}</Link></li>
            <li><Link href="/settings" className="hover:text-foreground">{t.footer.settings}</Link></li>
            <li><Link href="/event/evt-009" className="hover:text-foreground">{t.footer.featuredEvent}</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="mb-3 text-sm font-semibold">{t.footer.riskWarningTitle}</h3>
          <p className="text-xs leading-relaxed text-muted">{t.footer.riskWarningBody}</p>
        </div>
      </div>
      <div className="border-t border-border py-4 text-center text-xs text-muted">
        © {new Date().getFullYear()} {t.footer.rights}
      </div>
    </footer>
  );
}
