"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { CalendarOff, ChevronLeft, ChevronRight } from "lucide-react";
import type { EconomicEvent, Impact } from "@/lib/types";
import { cn, formatDayLabel, formatEventTime, utcDayKey } from "@/lib/utils";
import { useLocalStorageValue } from "@/lib/use-local-storage";
import ImpactBadge from "@/components/impact-badge";

const IMPACT_FILTERS: { value: Impact | "all"; label: string }[] = [
  { value: "all", label: "All" },
  { value: "high", label: "High" },
  { value: "medium", label: "Medium" },
  { value: "low", label: "Low" },
  { value: "holiday", label: "Holiday" },
];

const TIMEZONES = ["UTC", "America/New_York", "Europe/London", "Europe/Berlin", "Asia/Tokyo", "Australia/Sydney"];

export default function CalendarClient({
  events,
  days,
}: {
  events: EconomicEvent[];
  days: string[];
}) {
  const today = utcDayKey(0);
  const initialIndex = Math.max(0, days.indexOf(today));
  const [dayIndex, setDayIndex] = useState(initialIndex);
  const [impactOverride, setImpactOverride] = useState<Impact | "all" | null>(null);
  const [currency, setCurrency] = useState("all");
  const [tzOverride, setTzOverride] = useState<string | null>(null);

  const storedTz = useLocalStorageValue("fn-timezone");
  const storedImpact = useLocalStorageValue("fn-impact");

  const timeZone =
    tzOverride ?? (storedTz && TIMEZONES.includes(storedTz) ? storedTz : "UTC");
  const impact: Impact | "all" =
    impactOverride ??
    (storedImpact && ["high", "medium", "low", "holiday"].includes(storedImpact)
      ? (storedImpact as Impact)
      : "all");

  const currencies = useMemo(
    () => [...new Set(events.map((e) => e.currency))].sort(),
    [events]
  );

  const dayKey = days[dayIndex] ?? today;
  const dayEvents = events.filter(
    (e) =>
      e.date.slice(0, 10) === dayKey &&
      (impact === "all" || e.impact === impact) &&
      (currency === "all" || e.currency === currency)
  );

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-1 rounded-lg border border-border bg-surface p-1">
          <button
            onClick={() => setDayIndex((i) => Math.max(0, i - 1))}
            disabled={dayIndex === 0}
            aria-label="Previous day"
            className="flex h-8 w-8 items-center justify-center rounded-md text-muted transition-colors hover:bg-surface-2 hover:text-foreground disabled:opacity-40"
          >
            <ChevronLeft size={16} />
          </button>
          <span className="min-w-28 text-center text-sm font-semibold">
            {formatDayLabel(dayKey)}
            {dayKey === today && <span className="ml-2 text-xs font-medium text-brand">Today</span>}
          </span>
          <button
            onClick={() => setDayIndex((i) => Math.min(days.length - 1, i + 1))}
            disabled={dayIndex >= days.length - 1}
            aria-label="Next day"
            className="flex h-8 w-8 items-center justify-center rounded-md text-muted transition-colors hover:bg-surface-2 hover:text-foreground disabled:opacity-40"
          >
            <ChevronRight size={16} />
          </button>
        </div>

        <div className="flex items-center gap-1 rounded-lg border border-border bg-surface p-1">
          {IMPACT_FILTERS.map((f) => (
            <button
              key={f.value}
              onClick={() => setImpactOverride(f.value)}
              className={cn(
                "rounded-md px-2.5 py-1 text-xs font-medium transition-colors",
                impact === f.value
                  ? "bg-brand text-white"
                  : "text-muted hover:bg-surface-2 hover:text-foreground"
              )}
            >
              {f.label}
            </button>
          ))}
        </div>

        <select
          value={currency}
          onChange={(e) => setCurrency(e.target.value)}
          className="h-10 rounded-lg border border-border bg-surface px-3 text-sm outline-none focus:border-brand"
        >
          <option value="all">All currencies</option>
          {currencies.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>

        <select
          value={timeZone}
          onChange={(e) => setTzOverride(e.target.value)}
          className="h-10 rounded-lg border border-border bg-surface px-3 text-sm outline-none focus:border-brand"
          aria-label="Timezone"
        >
          {TIMEZONES.map((tz) => (
            <option key={tz} value={tz}>
              {tz.replace("_", " ")}
            </option>
          ))}
        </select>
      </div>

      <div className="overflow-hidden rounded-xl border border-border bg-surface">
        <div className="hidden grid-cols-[90px_70px_90px_1fr_80px_80px_80px] gap-3 border-b border-border bg-surface-2 px-4 py-2.5 text-xs font-semibold uppercase tracking-wide text-muted md:grid">
          <span>Time</span>
          <span>Cur</span>
          <span>Impact</span>
          <span>Event</span>
          <span className="text-right">Actual</span>
          <span className="text-right">Forecast</span>
          <span className="text-right">Previous</span>
        </div>
        {dayEvents.length === 0 ? (
          <div className="flex flex-col items-center gap-2 py-16 text-muted">
            <CalendarOff size={28} />
            <p className="text-sm">No events match your filters for this day.</p>
          </div>
        ) : (
          dayEvents.map((e) => (
            <Link
              key={e.id}
              href={`/event/${e.id}`}
              className="grid grid-cols-2 gap-2 border-b border-border px-4 py-3 transition-colors last:border-0 hover:bg-surface-2 md:grid-cols-[90px_70px_90px_1fr_80px_80px_80px] md:items-center md:gap-3"
            >
              <span className="text-sm font-medium tabular-nums">
                {formatEventTime(e.date, timeZone)}
              </span>
              <span className="text-sm font-semibold">{e.currency}</span>
              <span>
                <ImpactBadge impact={e.impact} />
              </span>
              <span className="col-span-2 text-sm md:col-span-1">{e.title}</span>
              <span className="text-right font-mono text-sm font-semibold text-foreground">
                {e.actual ?? "—"}
              </span>
              <span className="text-right font-mono text-sm text-muted">
                {e.forecast ?? "—"}
              </span>
              <span className="text-right font-mono text-sm text-muted">
                {e.previous ?? "—"}
              </span>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
