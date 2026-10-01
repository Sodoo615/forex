import type { Metadata } from "next";
import { getQuotes } from "@/lib/api";
import MarketsClient from "./markets-client";

export const metadata: Metadata = {
  title: "Market Overview",
  description: "Live quotes for major forex pairs, crosses, metals, indices and crypto.",
};

export const dynamic = "force-dynamic";

export default async function MarketsPage() {
  const quotes = await getQuotes();
  return <MarketsClient quotes={quotes} />;
}
