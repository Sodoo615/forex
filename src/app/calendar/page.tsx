import type { Metadata } from "next";
import { getAvailableDays, getEvents } from "@/lib/api";
import CalendarClient from "./calendar-client";

export const metadata: Metadata = {
  title: "Economic Calendar",
  description: "Live economic calendar with high-impact forex events, forecasts and results.",
};

export const dynamic = "force-dynamic";

export default async function CalendarPage() {
  const [events, days] = await Promise.all([getEvents(), getAvailableDays()]);
  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="mb-1 text-2xl font-bold tracking-tight sm:text-3xl">Economic Calendar</h1>
      <p className="mb-6 text-muted">
        Track market-moving economic releases with forecasts, previous readings and results.
      </p>
      <CalendarClient events={events} days={days} />
    </div>
  );
}
