"use client";

import Link from "next/link";
import { ArrowLeft, Landmark } from "lucide-react";
import type { CurrencyInfo, EconomicEvent, MarketQuote } from "@/lib/types";
import ImpactBadge from "@/components/impact-badge";
import { formatDayLabel, formatEventTime } from "@/lib/utils";
import { useLang } from "@/lib/i18n/language-context";
import { localizeCurrency, localizeEvent } from "@/lib/i18n/content";

export default function CurrencyDetailClient({
  currency,
  upcoming,
  pairs,
}: {
  currency: CurrencyInfo;
  upcoming: EconomicEvent[];
  pairs: MarketQuote[];
}) {
  const { lang, t } = useLang();
  const c = localizeCurrency(currency, lang);
  const localizedUpcoming = upcoming.map((e) => localizeEvent(e, lang));

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <Link
        href="/currencies"
        className="mb-4 inline-flex items-center gap-1 text-sm text-muted hover:text-foreground"
      >
        <ArrowLeft size={14} /> {t.currencies.allCurrencies}
      </Link>

      <div className="mb-6 flex items-center gap-4">
        <span className="flex h-14 w-14 items-center justify-center rounded-xl bg-brand/10 text-lg font-bold text-brand">
          {c.code}
        </span>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{c.name}</h1>
          <p className="text-sm text-muted">
            {c.nation} · {t.currencies.nicknamed} &ldquo;{c.nickname}&rdquo;
          </p>
        </div>
      </div>

      <div className="mb-8 grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-border bg-surface p-5">
          <h2 className="mb-1 flex items-center gap-2 text-sm font-semibold text-muted">
            <Landmark size={14} /> {t.currencies.centralBank}
          </h2>
          <p className="font-semibold">{c.centralBank}</p>
        </div>
        <div className="rounded-xl border border-border bg-surface p-5">
          <h2 className="mb-1 text-sm font-semibold text-muted">{t.currencies.policyRate}</h2>
          <p className="font-mono text-xl font-bold text-brand">{c.interestRate}</p>
        </div>
      </div>

      <section className="mb-8 rounded-xl border border-border bg-surface p-6">
        <h2 className="mb-2 font-semibold">{t.currencies.about} {c.code}</h2>
        <p className="text-sm leading-relaxed text-muted">{c.description}</p>
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        <section>
          <h2 className="mb-3 font-semibold">{t.currencies.upcomingEvents}</h2>
          <div className="overflow-hidden rounded-xl border border-border bg-surface">
            {localizedUpcoming.length === 0 ? (
              <p className="p-5 text-sm text-muted">{t.currencies.noUpcoming}</p>
            ) : (
              localizedUpcoming.map((e) => (
                <Link
                  key={e.id}
                  href={`/event/${e.id}`}
                  className="flex items-center justify-between gap-3 border-b border-border px-4 py-3 text-sm last:border-0 hover:bg-surface-2"
                >
                  <div>
                    <div className="font-medium">{e.title}</div>
                    <div className="text-xs text-muted">
                      {formatDayLabel(e.date.slice(0, 10), lang)} · {formatEventTime(e.date, "UTC", lang)}
                    </div>
                  </div>
                  <ImpactBadge impact={e.impact} />
                </Link>
              ))
            )}
          </div>
        </section>

        <section>
          <h2 className="mb-3 font-semibold">{t.currencies.relatedPairs}</h2>
          <div className="overflow-hidden rounded-xl border border-border bg-surface">
            {pairs.length === 0 ? (
              <p className="p-5 text-sm text-muted">{t.currencies.noPairs}</p>
            ) : (
              pairs.map((q) => (
                <div
                  key={q.symbol}
                  className="flex items-center justify-between border-b border-border px-4 py-3 text-sm last:border-0"
                >
                  <span className="font-medium">{q.symbol}</span>
                  <span className="font-mono text-muted">{q.bid.toFixed(q.decimals)}</span>
                  <span
                    className={`font-semibold ${q.changePct >= 0 ? "text-up" : "text-down"}`}
                  >
                    {q.changePct >= 0 ? "+" : ""}
                    {q.changePct.toFixed(2)}%
                  </span>
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
