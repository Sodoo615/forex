"use client";

import { TrendingDown, TrendingUp } from "lucide-react";
import type { MarketQuote } from "@/lib/types";
import Sparkline from "@/components/sparkline";
import QuoteRow from "@/components/quote-row";
import { cn } from "@/lib/utils";
import { useLang } from "@/lib/i18n/language-context";

export default function MarketsClient({ quotes }: { quotes: MarketQuote[] }) {
  const { t } = useLang();

  const GROUPS: { title: string; match: (q: MarketQuote) => boolean }[] = [
    { title: t.markets.majorPairs, match: (q) => /^(EUR|GBP|AUD|NZD)\/USD|^USD\/(JPY|CHF|CAD)$/.test(q.symbol) },
    {
      title: t.markets.crosses,
      match: (q) =>
        q.symbol.includes("/") &&
        !/^(EUR|GBP|AUD|NZD)\/USD|^USD\/(JPY|CHF|CAD)$/.test(q.symbol) &&
        !/^(XAU|XAG|BTC)\//.test(q.symbol),
    },
    { title: t.markets.metalsCommodities, match: (q) => /^(XAU|XAG)\//.test(q.symbol) || q.symbol === "WTI" },
    {
      title: t.markets.indicesCrypto,
      match: (q) => /^(US500|US30|NAS100|DXY)$/.test(q.symbol) || q.symbol.startsWith("BTC"),
    },
  ];

  const sorted = [...quotes].sort((a, b) => b.changePct - a.changePct);
  const gainers = sorted.slice(0, 3);
  const losers = sorted.slice(-3).reverse();

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="mb-1 text-2xl font-bold tracking-tight sm:text-3xl">{t.markets.title}</h1>
      <p className="mb-6 text-muted">{t.markets.subtitle}</p>

      <div className="mb-8 grid gap-4 sm:grid-cols-2">
        <section className="rounded-xl border border-border bg-surface p-5">
          <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold text-up">
            <TrendingUp size={16} /> {t.markets.topGainers}
          </h2>
          <ul className="space-y-2">
            {gainers.map((q) => (
              <li key={q.symbol} className="flex items-center justify-between text-sm">
                <span className="font-medium">{q.symbol}</span>
                <span className="font-mono text-xs text-muted">{q.bid.toFixed(q.decimals)}</span>
                <span className="font-semibold text-up">+{q.changePct.toFixed(2)}%</span>
              </li>
            ))}
          </ul>
        </section>
        <section className="rounded-xl border border-border bg-surface p-5">
          <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold text-down">
            <TrendingDown size={16} /> {t.markets.topLosers}
          </h2>
          <ul className="space-y-2">
            {losers.map((q) => (
              <li key={q.symbol} className="flex items-center justify-between text-sm">
                <span className="font-medium">{q.symbol}</span>
                <span className="font-mono text-xs text-muted">{q.bid.toFixed(q.decimals)}</span>
                <span className="font-semibold text-down">{q.changePct.toFixed(2)}%</span>
              </li>
            ))}
          </ul>
        </section>
      </div>

      {GROUPS.map((group) => {
        const items = quotes.filter(group.match);
        if (items.length === 0) return null;
        return (
          <section key={group.title} className="mb-8">
            <h2 className="mb-3 text-lg font-bold">{group.title}</h2>
            <div className="overflow-hidden rounded-xl border border-border bg-surface">
              <div className="hidden grid-cols-[110px_1fr_90px_90px_90px_110px_120px] gap-3 border-b border-border bg-surface-2 px-4 py-2.5 text-xs font-semibold uppercase tracking-wide text-muted md:grid">
                <span>{t.markets.symbol}</span>
                <span>{t.markets.name}</span>
                <span className="text-right">{t.markets.bid}</span>
                <span className="text-right">{t.markets.ask}</span>
                <span className="text-right">{t.markets.change}</span>
                <span className="text-right">{t.markets.dayRange}</span>
                <span className="text-right">24h</span>
              </div>
              {items.map((q) => {
                const up = q.changePct >= 0;
                return (
                  <div
                    key={q.symbol}
                    className="grid grid-cols-2 gap-2 border-b border-border px-4 py-3 last:border-0 md:grid-cols-[110px_1fr_90px_90px_90px_110px_120px] md:items-center md:gap-3"
                  >
                    <span className="text-sm font-semibold">{q.symbol}</span>
                    <span className="truncate text-sm text-muted">{q.name}</span>
                    <span className="text-right font-mono text-sm">{q.bid.toFixed(q.decimals)}</span>
                    <span className="text-right font-mono text-sm text-muted">
                      {q.ask.toFixed(q.decimals)}
                    </span>
                    <span
                      className={cn(
                        "text-right font-mono text-sm font-semibold",
                        up ? "text-up" : "text-down"
                      )}
                    >
                      {up ? "+" : ""}
                      {q.changePct.toFixed(2)}%
                    </span>
                    <span className="text-right font-mono text-xs text-muted">
                      {q.dayLow.toFixed(q.decimals)} – {q.dayHigh.toFixed(q.decimals)}
                    </span>
                    <span className="flex justify-end">
                      <Sparkline data={q.sparkline} positive={up} width={110} height={28} />
                    </span>
                  </div>
                );
              })}
            </div>
          </section>
        );
      })}

      <section>
        <h2 className="mb-3 text-lg font-bold">{t.markets.quickView}</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {quotes.slice(0, 6).map((q) => (
            <QuoteRow key={q.symbol} quote={q} />
          ))}
        </div>
      </section>
    </div>
  );
}
