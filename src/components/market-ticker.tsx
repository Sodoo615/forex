"use client";

import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import type { MarketQuote } from "@/lib/types";
import { cn } from "@/lib/utils";

export default function MarketTicker({ quotes }: { quotes: MarketQuote[] }) {
  const items = [...quotes, ...quotes];
  return (
    <div className="overflow-hidden border-b border-border bg-surface">
      <div className="animate-marquee flex w-max items-center gap-8 px-4 py-2">
        {items.map((q, i) => {
          const up = q.changePct >= 0;
          return (
            <div key={`${q.symbol}-${i}`} className="flex items-center gap-2 text-xs whitespace-nowrap">
              <span className="font-semibold">{q.symbol}</span>
              <span className="font-mono text-muted">{q.bid.toFixed(q.decimals)}</span>
              <span
                className={cn(
                  "flex items-center gap-0.5 font-medium",
                  up ? "text-up" : "text-down"
                )}
              >
                {up ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                {up ? "+" : ""}
                {q.changePct.toFixed(2)}%
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
