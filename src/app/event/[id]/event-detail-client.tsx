"use client";

import Link from "next/link";
import { ArrowLeft, BarChart3, Building2, Clock3, Repeat } from "lucide-react";
import type { EconomicEvent } from "@/lib/types";
import ImpactBadge from "@/components/impact-badge";
import { formatFullDate } from "@/lib/utils";
import { useLang } from "@/lib/i18n/language-context";
import { localizeEvent } from "@/lib/i18n/content";

export default function EventDetailClient({
  event,
  related,
}: {
  event: EconomicEvent;
  related: EconomicEvent[];
}) {
  const { lang, t } = useLang();
  const e = localizeEvent(event, lang);
  const localizedRelated = related.map((r) => localizeEvent(r, lang));

  const stats = [
    { label: t.event.actual, value: e.actual },
    { label: t.event.forecast, value: e.forecast },
    { label: t.event.previous, value: e.previous },
  ];

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <Link
        href="/calendar"
        className="mb-4 inline-flex items-center gap-1 text-sm text-muted hover:text-foreground"
      >
        <ArrowLeft size={14} /> {t.event.backToCalendar}
      </Link>

      <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="mb-2 flex items-center gap-2">
            <span className="rounded-md bg-brand/10 px-2 py-0.5 text-sm font-bold text-brand">
              {e.currency}
            </span>
            <ImpactBadge impact={e.impact} />
          </div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{e.title}</h1>
          <p className="mt-1 flex items-center gap-1.5 text-sm text-muted">
            <Clock3 size={14} /> {formatFullDate(e.date, "UTC", lang)}
          </p>
        </div>
      </div>

      <div className="mb-8 grid grid-cols-3 gap-3">
        {stats.map((s) => (
          <div
            key={s.label}
            className="rounded-xl border border-border bg-surface p-4 text-center"
          >
            <div className="mb-1 text-xs font-semibold uppercase tracking-wide text-muted">
              {s.label}
            </div>
            <div className="font-mono text-lg font-bold">{s.value ?? "—"}</div>
          </div>
        ))}
      </div>

      <section className="mb-6 rounded-xl border border-border bg-surface p-6">
        <h2 className="mb-2 font-semibold">{t.event.aboutRelease}</h2>
        <p className="text-sm leading-relaxed text-muted">{e.description}</p>
      </section>

      <div className="mb-8 grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-border bg-surface p-5">
          <h3 className="mb-1.5 flex items-center gap-2 text-sm font-semibold">
            <BarChart3 size={14} className="text-brand" /> {t.event.measures}
          </h3>
          <p className="text-sm text-muted">{e.measures}</p>
        </div>
        <div className="rounded-xl border border-border bg-surface p-5">
          <h3 className="mb-1.5 flex items-center gap-2 text-sm font-semibold">
            <Repeat size={14} className="text-brand" /> {t.event.frequency}
          </h3>
          <p className="text-sm text-muted">{e.frequency}</p>
        </div>
        <div className="rounded-xl border border-border bg-surface p-5">
          <h3 className="mb-1.5 text-sm font-semibold">{t.event.usualEffect}</h3>
          <p className="text-sm text-muted">{e.usualEffect}</p>
        </div>
        <div className="rounded-xl border border-border bg-surface p-5">
          <h3 className="mb-1.5 flex items-center gap-2 text-sm font-semibold">
            <Building2 size={14} className="text-brand" /> {t.event.source}
          </h3>
          <p className="text-sm text-muted">{e.source}</p>
        </div>
      </div>

      {localizedRelated.length > 0 && (
        <section>
          <h2 className="mb-3 font-semibold">{t.event.moreEvents} ({e.currency})</h2>
          <div className="overflow-hidden rounded-xl border border-border bg-surface">
            {localizedRelated.map((r) => (
              <Link
                key={r.id}
                href={`/event/${r.id}`}
                className="flex items-center justify-between gap-3 border-b border-border px-4 py-3 text-sm last:border-0 hover:bg-surface-2"
              >
                <span className="font-medium">{r.title}</span>
                <ImpactBadge impact={r.impact} />
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
