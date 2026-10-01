import type { Metadata } from "next";
import { getCurrencies } from "@/lib/api";
import CurrenciesClient from "./currencies-client";

export const metadata: Metadata = {
  title: "Currencies",
  description: "Profiles of the major world currencies, central banks and policy rates.",
};

export default async function CurrenciesPage() {
  const currencies = await getCurrencies();
  return <CurrenciesClient currencies={currencies} />;
}
