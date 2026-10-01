import { getEventsByDay, getNews, getQuotes } from "@/lib/api";
import { utcDayKey } from "@/lib/utils";
import HomeClient from "./home-client";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const todayKey = utcDayKey(0);
  const [todayEvents, news, quotes] = await Promise.all([
    getEventsByDay(todayKey),
    getNews(),
    getQuotes(),
  ]);

  return <HomeClient todayEvents={todayEvents} news={news} quotes={quotes} />;
}
