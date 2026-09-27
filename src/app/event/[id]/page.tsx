import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, BarChart3, Building2, Clock3, Repeat } from "lucide-react";
import { getEventById, getEventsByCurrency } from "@/lib/api";
import ImpactBadge from "@/components/impact-badge";
import { formatFullDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const event = await getEventById(id);
  return { title: event ? event.title : "Event" };
}

export default async function EventDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const event = await getEventById(id);
  if (!event) notFound();

  const related = (await getEventsByCurrency(event.currency))
    .filter((e) => e.id !== event.id)
    .slice(0, 5);

  const stats = [
    { label: "Actual", value: event.actual },
    { label: "Forecast", value: event.forecast },
    { label: "Previous", value: event.previous },
  ];

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <Link
        href="/calendar"
        className="mb-4 inline-flex items-center gap-1 text-sm text-muted hover:text-foreground"
      >
        <ArrowLeft size={14} /> Back to calendar
      </Link>

      <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="mb-2 flex items-center gap-2">
            <span className="rounded-md bg-brand/10 px-2 py-0.5 text-sm font-bold text-brand">
              {event.currency}
            </span>
            <ImpactBadge impact={event.impact} />
          </div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{event.title}</h1>
          <p className="mt-1 flex items-center gap-1.5 text-sm text-muted">
            <Clock3 size={14} /> {formatFullDate(event.date)}
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
        <h2 className="mb-2 font-semibold">About this release</h2>
        <p className="text-sm leading-relaxed text-muted">{event.description}</p>
      </section>

      <div className="mb-8 grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-border bg-surface p-5">
          <h3 className="mb-1.5 flex items-center gap-2 text-sm font-semibold">
            <BarChart3 size={14} className="text-brand" /> Measures
          </h3>
          <p className="text-sm text-muted">{event.measures}</p>
        </div>
        <div className="rounded-xl border border-border bg-surface p-5">
          <h3 className="mb-1.5 flex items-center gap-2 text-sm font-semibold">
            <Repeat size={14} className="text-brand" /> Frequency
          </h3>
          <p className="text-sm text-muted">{event.frequency}</p>
        </div>
        <div className="rounded-xl border border-border bg-surface p-5">
          <h3 className="mb-1.5 text-sm font-semibold">Usual Effect</h3>
          <p className="text-sm text-muted">{event.usualEffect}</p>
        </div>
        <div className="rounded-xl border border-border bg-surface p-5">
          <h3 className="mb-1.5 flex items-center gap-2 text-sm font-semibold">
            <Building2 size={14} className="text-brand" /> Source
          </h3>
          <p className="text-sm text-muted">{event.source}</p>
        </div>
      </div>

      {related.length > 0 && (
        <section>
          <h2 className="mb-3 font-semibold">More {event.currency} events</h2>
          <div className="overflow-hidden rounded-xl border border-border bg-surface">
            {related.map((e) => (
              <Link
                key={e.id}
                href={`/event/${e.id}`}
                className="flex items-center justify-between gap-3 border-b border-border px-4 py-3 text-sm last:border-0 hover:bg-surface-2"
              >
                <span className="font-medium">{e.title}</span>
                <ImpactBadge impact={e.impact} />
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
