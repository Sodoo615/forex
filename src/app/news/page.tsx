import type { Metadata } from "next";
import { getNews } from "@/lib/api";
import NewsClient from "./news-client";

export const metadata: Metadata = {
  title: "Forex News",
  description: "Breaking forex news, central bank coverage and currency market analysis.",
};

export const dynamic = "force-dynamic";

export default async function NewsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const news = await getNews();
  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <NewsClient articles={news} initialQuery={q ?? ""} />
    </div>
  );
}
