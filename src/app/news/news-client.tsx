"use client";

import { useMemo, useState } from "react";
import { Newspaper, Search } from "lucide-react";
import type { NewsArticle } from "@/lib/types";
import { cn, timeAgo } from "@/lib/utils";
import NewsCard from "@/components/news-card";
import { useLang } from "@/lib/i18n/language-context";
import { localizeArticle } from "@/lib/i18n/content";

const CATEGORIES = ["All", "Breaking", "Analysis", "Central Banks", "Geopolitics", "Technical", "Education"] as const;

export default function NewsClient({
  articles,
  initialQuery,
}: {
  articles: NewsArticle[];
  initialQuery: string;
}) {
  const { lang, t } = useLang();
  const [query, setQuery] = useState(initialQuery);
  const [category, setCategory] = useState<(typeof CATEGORIES)[number]>("All");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return articles
      .map((a) => localizeArticle(a, lang))
      .filter((a) => {
        const matchesCategory = category === "All" || a.category === category;
        const matchesQuery =
          !q ||
          a.title.toLowerCase().includes(q) ||
          a.summary.toLowerCase().includes(q) ||
          a.source.toLowerCase().includes(q);
        return matchesCategory && matchesQuery;
      });
  }, [articles, query, category, lang]);

  const [featured, ...rest] = filtered;

  return (
    <div>
      <h1 className="mb-1 text-2xl font-bold tracking-tight sm:text-3xl">{t.news.title}</h1>
      <p className="mb-6 text-muted">{t.news.subtitle}</p>
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <div className="relative w-full max-w-sm">
          <Search size={15} className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-muted" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t.news.searchPlaceholder}
            className="h-10 w-full rounded-lg border border-border bg-surface pl-8 pr-3 text-sm outline-none placeholder:text-muted focus:border-brand"
          />
        </div>
        <div className="flex flex-wrap items-center gap-1 rounded-lg border border-border bg-surface p-1">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={cn(
                "rounded-md px-2.5 py-1 text-xs font-medium transition-colors",
                category === c
                  ? "bg-brand text-white"
                  : "text-muted hover:bg-surface-2 hover:text-foreground"
              )}
            >
              {t.news.categories[c]}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center gap-2 rounded-xl border border-border bg-surface py-16 text-muted">
          <Newspaper size={28} />
          <p className="text-sm">{t.news.noArticles}</p>
        </div>
      ) : (
        <>
          {featured && (
            <article
              id={featured.id}
              className="mb-6 rounded-xl border border-border bg-surface p-6 transition-colors hover:border-brand/50 sm:p-8"
            >
              <div className="mb-3 flex items-center gap-2">
                <span className="rounded bg-brand/15 px-1.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-brand">
                  {t.news.featured}
                </span>
                <span className="rounded bg-surface-2 px-1.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-muted">
                  {t.news.categories[featured.category]}
                </span>
                <span className="text-xs text-muted">{timeAgo(featured.publishedAt, t.time)}</span>
              </div>
              <h2 className="mb-3 text-xl font-bold leading-snug sm:text-2xl">{featured.title}</h2>
              <p className="mb-4 text-muted">{featured.summary}</p>
              {featured.body.slice(0, 2).map((p, i) => (
                <p key={i} className="mb-3 text-sm leading-relaxed text-muted">
                  {p}
                </p>
              ))}
              <div className="mt-4 flex items-center gap-3 text-xs text-muted">
                <span className="font-medium text-foreground">{featured.source}</span>
                <span>{featured.readMinutes} {t.news.minRead}</span>
              </div>
            </article>
          )}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {rest.map((a) => (
              <div key={a.id} id={a.id}>
                <NewsCard article={a} />
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
