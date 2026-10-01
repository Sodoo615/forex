"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Menu, Moon, Search, Sun, TrendingUp, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLang } from "@/lib/i18n/language-context";

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { lang, setLang, t } = useLang();
  const [query, setQuery] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [dark, setDark] = useState(
    () =>
      typeof document === "undefined" ||
      document.documentElement.classList.contains("dark")
  );

  const NAV = [
    { href: "/", label: t.nav.home },
    { href: "/calendar", label: t.nav.calendar },
    { href: "/news", label: t.nav.news },
    { href: "/markets", label: t.nav.markets },
    { href: "/currencies", label: t.nav.currencies },
  ];

  function toggleTheme() {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    try {
      localStorage.setItem("fn-theme", next ? "dark" : "light");
    } catch {
      // storage unavailable
    }
  }

  function submitSearch(e: React.FormEvent) {
    e.preventDefault();
    const q = query.trim();
    if (q) {
      router.push(`/news?q=${encodeURIComponent(q)}`);
      setMenuOpen(false);
    }
  }

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-surface/90 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-7xl items-center gap-4 px-4">
        <Link href="/" className="flex shrink-0 items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand text-white">
            <TrendingUp size={18} strokeWidth={2.5} />
          </span>
          <span className="text-lg font-bold tracking-tight">
            Forex<span className="text-brand">News</span>
          </span>
        </Link>

        <nav className="ml-4 hidden items-center gap-1 md:flex">
          {NAV.map((item) => {
            const active =
              item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
                  active
                    ? "bg-brand/10 text-brand"
                    : "text-muted hover:bg-surface-2 hover:text-foreground"
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <form onSubmit={submitSearch} className="ml-auto hidden max-w-xs flex-1 sm:block">
          <div className="relative">
            <Search
              size={15}
              className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-muted"
            />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t.header.searchPlaceholder}
              className="h-8 w-full rounded-md border border-border bg-surface-2 pl-8 pr-3 text-sm outline-none placeholder:text-muted focus:border-brand"
            />
          </div>
        </form>

        <div
          className="ml-auto flex items-center gap-0.5 rounded-md border border-border p-0.5 text-xs font-semibold sm:ml-0"
          role="group"
          aria-label={t.language.toggle}
        >
          <button
            onClick={() => setLang("en")}
            className={cn(
              "rounded px-1.5 py-1 transition-colors",
              lang === "en" ? "bg-brand text-white" : "text-muted hover:text-foreground"
            )}
          >
            EN
          </button>
          <button
            onClick={() => setLang("mn")}
            className={cn(
              "rounded px-1.5 py-1 transition-colors",
              lang === "mn" ? "bg-brand text-white" : "text-muted hover:text-foreground"
            )}
          >
            MN
          </button>
        </div>

        <button
          onClick={toggleTheme}
          aria-label={t.header.toggleTheme}
          className="flex h-8 w-8 items-center justify-center rounded-md border border-border text-muted transition-colors hover:text-foreground"
        >
          {dark ? <Sun size={16} /> : <Moon size={16} />}
        </button>

        <button
          onClick={() => setMenuOpen((v) => !v)}
          aria-label={t.header.toggleMenu}
          className="flex h-8 w-8 items-center justify-center rounded-md border border-border text-muted md:hidden"
        >
          {menuOpen ? <X size={16} /> : <Menu size={16} />}
        </button>
      </div>

      {menuOpen && (
        <div className="border-t border-border px-4 py-3 md:hidden">
          <form onSubmit={submitSearch} className="mb-3 sm:hidden">
            <div className="relative">
              <Search
                size={15}
                className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-muted"
              />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t.header.searchPlaceholder}
                className="h-9 w-full rounded-md border border-border bg-surface-2 pl-8 pr-3 text-sm outline-none placeholder:text-muted focus:border-brand"
              />
            </div>
          </form>
          <nav className="flex flex-col gap-1">
            {NAV.map((item) => {
              const active =
                item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  className={cn(
                    "rounded-md px-3 py-2 text-sm font-medium",
                    active ? "bg-brand/10 text-brand" : "text-muted hover:bg-surface-2"
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
      )}
    </header>
  );
}
