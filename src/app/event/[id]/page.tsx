import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getEventById, getEventsByCurrency } from "@/lib/api";
import EventDetailClient from "./event-detail-client";

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

  return <EventDetailClient event={event} related={related} />;
}
