import Link from "next/link";
import { TrendingUp } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-border bg-surface">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="mb-3 flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-md bg-brand text-white">
              <TrendingUp size={15} strokeWidth={2.5} />
            </span>
            <span className="font-bold">
              Forex<span className="text-brand">News</span>
            </span>
          </div>
          <p className="text-sm text-muted">
            Economic calendar, forex news and market data for traders. Built with
            an API-ready architecture.
          </p>
        </div>
        <div>
          <h3 className="mb-3 text-sm font-semibold">Product</h3>
          <ul className="space-y-2 text-sm text-muted">
            <li><Link href="/calendar" className="hover:text-foreground">Economic Calendar</Link></li>
            <li><Link href="/news" className="hover:text-foreground">Forex News</Link></li>
            <li><Link href="/markets" className="hover:text-foreground">Market Overview</Link></li>
            <li><Link href="/currencies" className="hover:text-foreground">Currencies</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="mb-3 text-sm font-semibold">Resources</h3>
          <ul className="space-y-2 text-sm text-muted">
            <li><Link href="/news" className="hover:text-foreground">Market Analysis</Link></li>
            <li><Link href="/settings" className="hover:text-foreground">Settings</Link></li>
            <li><Link href="/event/evt-009" className="hover:text-foreground">Featured Event</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="mb-3 text-sm font-semibold">Risk Warning</h3>
          <p className="text-xs leading-relaxed text-muted">
            Trading foreign exchange on margin carries a high level of risk and may
            not be suitable for all investors. Past performance is not indicative of
            future results. All data shown is for informational purposes only.
          </p>
        </div>
      </div>
      <div className="border-t border-border py-4 text-center text-xs text-muted">
        © {new Date().getFullYear()} Forex News. All rights reserved.
      </div>
    </footer>
  );
}
