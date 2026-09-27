import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Landmark } from "lucide-react";
import { getCurrencies } from "@/lib/api";

export const metadata: Metadata = {
  title: "Currencies",
  description: "Profiles of the major world currencies, central banks and policy rates.",
};

export default async function CurrenciesPage() {
  const currencies = await getCurrencies();
  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="mb-1 text-2xl font-bold tracking-tight sm:text-3xl">Currency Information</h1>
      <p className="mb-6 text-muted">
        Profiles of the major world currencies, their central banks and current policy rates.
      </p>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {currencies.map((c) => (
          <Link
            key={c.code}
            href={`/currencies/${c.code.toLowerCase()}`}
            className="group rounded-xl border border-border bg-surface p-5 transition-colors hover:border-brand/50"
          >
            <div className="mb-3 flex items-center justify-between">
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand/10 text-sm font-bold text-brand">
                {c.code}
              </span>
              <ArrowRight
                size={16}
                className="text-muted transition-transform group-hover:translate-x-0.5 group-hover:text-brand"
              />
            </div>
            <h2 className="font-semibold">{c.name}</h2>
            <p className="mb-3 text-xs text-muted">
              {c.nation} · &ldquo;{c.nickname}&rdquo;
            </p>
            <div className="flex items-center gap-1.5 text-xs text-muted">
              <Landmark size={12} />
              {c.centralBank} · {c.interestRate}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
