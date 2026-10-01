"use client";

import Link from "next/link";
import { ArrowRight, CalendarDays, Flame, Newspaper } from "lucide-react";
import type { EconomicEvent, MarketQuote, NewsArticle } from "@/lib/types";
import MarketTicker from "@/components/market-ticker";
import ImpactBadge from "@/components/impact-badge";
import NewsCard from "@/components/news-card";
import QuoteRow from "@/components/quote-row";
import { useLang } from "@/lib/i18n/language-context";
import { localizeEvent } from "@/lib/i18n/content";

export default function HomeClient({
  todayEvents,
  news,
  quotes,
}: {
  todayEvents: EconomicEvent[];
  news: NewsArticle[];
  quotes: MarketQuote[];
}) {
  const { lang, t } = useLang();

  const highImpact = todayEvents.filter((e) => e.impact === "high").map((e) => localizeEvent(e, lang));
  const majors = quotes.filter((q) => q.symbol.includes("/")).slice(0, 6);
  const movers = [...quotes]
    .sort((a, b) => Math.abs(b.changePct) - Math.abs(a.changePct))
    .slice(0, 5);

  return (
    <>
      <MarketTicker quotes={quotes} />

      <div className="mx-auto max-w-7xl px-4 py-8">
        <section className="mb-8">
          <h1 className="mb-1 text-2xl font-bold tracking-tight sm:text-3xl">
            {t.home.title}
          </h1>
          <p className="text-muted">{t.home.subtitle}</p>
        </section>

        <div className="grid gap-6 lg:grid-cols-3">
          <section className="rounded-xl border border-border bg-surface p-5">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="flex items-center gap-2 font-semibold">
                <Flame size={16} className="text-red-500" />
                {t.home.highImpactToday}
              </h2>
              <Link
                href="/calendar"
                className="flex items-center gap-1 text-xs font-medium text-brand hover:underline"
              >
                {t.home.calendar} <ArrowRight size={12} />
              </Link>
            </div>
            {highImpact.length === 0 ? (
              <p className="text-sm text-muted">{t.home.noHighImpact}</p>
            ) : (
              <ul className="space-y-3">
                {highImpact.map((e) => (
                  <li key={e.id}>
                    <Link
                      href={`/event/${e.id}`}
                      className="group flex items-start justify-between gap-3"
                    >
                      <div>
                        <div className="text-sm font-medium group-hover:text-brand">
                          {e.title}
                        </div>
                        <div className="mt-0.5 text-xs text-muted">
                          {e.currency} · {t.home.forecast} {e.forecast ?? "—"} · {t.home.previous}{" "}
                          {e.previous ?? "—"}
                        </div>
                      </div>
                      <ImpactBadge impact={e.impact} />
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section className="rounded-xl border border-border bg-surface p-5">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="flex items-center gap-2 font-semibold">
                <CalendarDays size={16} className="text-brand" />
                {t.home.marketSnapshot}
              </h2>
              <Link
                href="/markets"
                className="flex items-center gap-1 text-xs font-medium text-brand hover:underline"
              >
                {t.home.markets} <ArrowRight size={12} />
              </Link>
            </div>
            <ul className="divide-y divide-border">
              {majors.map((q) => (
                <li key={q.symbol} className="flex items-center justify-between py-2">
                  <span className="text-sm font-medium">{q.symbol}</span>
                  <span className="flex items-baseline gap-2">
                    <span className="font-mono text-sm">{q.bid.toFixed(q.decimals)}</span>
                    <span
                      className={`text-xs font-medium ${q.changePct >= 0 ? "text-up" : "text-down"}`}
                    >
                      {q.changePct >= 0 ? "+" : ""}
                      {q.changePct.toFixed(2)}%
                    </span>
                  </span>
                </li>
              ))}
            </ul>
          </section>

          <section className="rounded-xl border border-border bg-surface p-5">
            <h2 className="mb-4 flex items-center gap-2 font-semibold">
              <Newspaper size={16} className="text-brand" />
              {t.home.topMovers}
            </h2>
            <ul className="divide-y divide-border">
              {movers.map((q) => (
                <li key={q.symbol} className="flex items-center justify-between py-2">
                  <span className="text-sm font-medium">{q.symbol}</span>
                  <span
                    className={`text-xs font-semibold ${q.changePct >= 0 ? "text-up" : "text-down"}`}
                  >
                    {q.changePct >= 0 ? "+" : ""}
                    {q.changePct.toFixed(2)}%
                  </span>
                </li>
              ))}
            </ul>
          </section>
        </div>

        <section className="mt-10">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-bold">{t.home.latestNews}</h2>
            <Link
              href="/news"
              className="flex items-center gap-1 text-sm font-medium text-brand hover:underline"
            >
              {t.home.viewAll} <ArrowRight size={14} />
            </Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {news.slice(0, 6).map((a) => (
              <NewsCard key={a.id} article={a} />
            ))}
          </div>
        </section>

        <section className="mt-10">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-bold">{t.home.majorPairs}</h2>
            <Link
              href="/markets"
              className="flex items-center gap-1 text-sm font-medium text-brand hover:underline"
            >
              {t.home.fullOverview} <ArrowRight size={14} />
            </Link>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {majors.map((q) => (
              <QuoteRow key={q.symbol} quote={q} />
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
