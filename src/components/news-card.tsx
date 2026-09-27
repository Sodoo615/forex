import Link from "next/link";
import { Clock } from "lucide-react";
import type { NewsArticle } from "@/lib/types";
import { timeAgo } from "@/lib/utils";

const CATEGORY_STYLES: Record<NewsArticle["category"], string> = {
  Breaking: "bg-red-500/15 text-red-600 dark:text-red-400",
  Analysis: "bg-blue-500/15 text-blue-600 dark:text-blue-400",
  "Central Banks": "bg-purple-500/15 text-purple-600 dark:text-purple-400",
  Geopolitics: "bg-amber-500/15 text-amber-600 dark:text-amber-400",
  Technical: "bg-cyan-500/15 text-cyan-600 dark:text-cyan-400",
  Education: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400",
};

export default function NewsCard({ article }: { article: NewsArticle }) {
  return (
    <article className="flex flex-col rounded-xl border border-border bg-surface p-5 transition-colors hover:border-brand/50">
      <div className="mb-2 flex items-center gap-2">
        <span
          className={`rounded px-1.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide ${CATEGORY_STYLES[article.category]}`}
        >
          {article.category}
        </span>
        <span className="flex items-center gap-1 text-xs text-muted">
          <Clock size={12} />
          {timeAgo(article.publishedAt)}
        </span>
      </div>
      <h3 className="mb-1.5 leading-snug font-semibold">
        <Link href={`/news#${article.id}`} className="hover:text-brand">
          {article.title}
        </Link>
      </h3>
      <p className="mb-3 flex-1 text-sm leading-relaxed text-muted">{article.summary}</p>
      <div className="flex items-center justify-between text-xs text-muted">
        <span className="font-medium">{article.source}</span>
        <span>{article.readMinutes} min read</span>
      </div>
    </article>
  );
}
