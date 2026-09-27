import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import type { MarketQuote } from "@/lib/types";
import { cn } from "@/lib/utils";
import Sparkline from "./sparkline";

export default function QuoteRow({ quote }: { quote: MarketQuote }) {
  const up = quote.changePct >= 0;
  return (
    <div className="flex items-center gap-3 rounded-xl border border-border bg-surface p-4">
      <div className="min-w-0 flex-1">
        <div className="font-semibold">{quote.symbol}</div>
        <div className="truncate text-xs text-muted">{quote.name}</div>
      </div>
      <Sparkline data={quote.sparkline} positive={up} />
      <div className="w-24 text-right">
        <div className="font-mono text-sm font-semibold">{quote.bid.toFixed(quote.decimals)}</div>
        <div
          className={cn(
            "flex items-center justify-end gap-0.5 text-xs font-medium",
            up ? "text-up" : "text-down"
          )}
        >
          {up ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
          {up ? "+" : ""}
          {quote.changePct.toFixed(2)}%
        </div>
      </div>
    </div>
  );
}
