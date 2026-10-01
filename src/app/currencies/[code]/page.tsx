import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCurrencyByCode, getRelatedPairs, getUpcomingEventsByCurrency } from "@/lib/api";
import CurrencyDetailClient from "./currency-detail-client";

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

  return <CurrencyDetailClient currency={currency} upcoming={upcoming} pairs={pairs} />;
}
