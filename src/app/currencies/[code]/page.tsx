import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Landmark } from "lucide-react";
import { getCurrencyByCode, getRelatedPairs, getUpcomingEventsByCurrency } from "@/lib/api";
import ImpactBadge from "@/components/impact-badge";
import { formatDayLabel, formatEventTime } from "@/lib/utils";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ code: string }>;
}): Promise<Metadata> {
  const { code } = await params;
  const currency = await getCurrencyByCode(code);
  return {
    title: currency ? `${currency.name} (${currency.code})` : "Currency",
  };
}

export default async function CurrencyDetailPage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;
  const currency = await getCurrencyByCode(code);
  if (!currency) notFound();

  const [upcoming, pairs] = await Promise.all([
    getUpcomingEventsByCurrency(currency.code),
    getRelatedPairs(currency.code),
  ]);

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <Link
        href="/currencies"
        className="mb-4 inline-flex items-center gap-1 text-sm text-muted hover:text-foreground"
      >
        <ArrowLeft size={14} /> All currencies
      </Link>

      <div className="mb-6 flex items-center gap-4">
        <span className="flex h-14 w-14 items-center justify-center rounded-xl bg-brand/10 text-lg font-bold text-brand">
          {currency.code}
        </span>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{currency.name}</h1>
          <p className="text-sm text-muted">
            {currency.nation} · Nicknamed &ldquo;{currency.nickname}&rdquo;
          </p>
        </div>
      </div>

      <div className="mb-8 grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-border bg-surface p-5">
          <h2 className="mb-1 flex items-center gap-2 text-sm font-semibold text-muted">
            <Landmark size={14} /> Central Bank
          </h2>
          <p className="font-semibold">{currency.centralBank}</p>
        </div>
        <div className="rounded-xl border border-border bg-surface p-5">
          <h2 className="mb-1 text-sm font-semibold text-muted">Policy Rate</h2>
          <p className="font-mono text-xl font-bold text-brand">{currency.interestRate}</p>
        </div>
      </div>

      <section className="mb-8 rounded-xl border border-border bg-surface p-6">
        <h2 className="mb-2 font-semibold">About the {currency.code}</h2>
        <p className="text-sm leading-relaxed text-muted">{currency.description}</p>
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        <section>
          <h2 className="mb-3 font-semibold">Upcoming {currency.code} Events</h2>
          <div className="overflow-hidden rounded-xl border border-border bg-surface">
            {upcoming.length === 0 ? (
              <p className="p-5 text-sm text-muted">No upcoming events scheduled.</p>
            ) : (
              upcoming.map((e) => (
                <Link
                  key={e.id}
                  href={`/event/${e.id}`}
                  className="flex items-center justify-between gap-3 border-b border-border px-4 py-3 text-sm last:border-0 hover:bg-surface-2"
                >
                  <div>
                    <div className="font-medium">{e.title}</div>
                    <div className="text-xs text-muted">
                      {formatDayLabel(e.date.slice(0, 10))} · {formatEventTime(e.date, "UTC")}
                    </div>
                  </div>
                  <ImpactBadge impact={e.impact} />
                </Link>
              ))
            )}
          </div>
        </section>

        <section>
          <h2 className="mb-3 font-semibold">Related Pairs</h2>
          <div className="overflow-hidden rounded-xl border border-border bg-surface">
            {pairs.length === 0 ? (
              <p className="p-5 text-sm text-muted">No related pairs available.</p>
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
