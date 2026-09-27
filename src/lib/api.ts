import { CURRENCIES, EVENTS, NEWS, QUOTES } from "./mock-data";
import type { CurrencyInfo, EconomicEvent, MarketQuote, NewsArticle } from "./types";

// API-ready service layer.
// Each function is async and returns data in the same shape a real REST API
// would. To connect a live backend, replace the mock lookups below with
// `fetch()` calls against your API — no component changes required.

export async function getEvents(): Promise<EconomicEvent[]> {
  return [...EVENTS].sort((a, b) => a.date.localeCompare(b.date));
}

export async function getEventById(id: string): Promise<EconomicEvent | null> {
  return EVENTS.find((e) => e.id === id) ?? null;
}

export async function getEventsByDay(dayKey: string): Promise<EconomicEvent[]> {
  const events = await getEvents();
  return events.filter((e) => e.date.slice(0, 10) === dayKey);
}

export async function getEventsByCurrency(code: string): Promise<EconomicEvent[]> {
  const events = await getEvents();
  return events.filter((e) => e.currency === code);
}

export async function getUpcomingEventsByCurrency(code: string): Promise<EconomicEvent[]> {
  const now = new Date().toISOString();
  const events = await getEventsByCurrency(code);
  return events.filter((e) => e.date >= now);
}

export async function getAvailableDays(): Promise<string[]> {
  const events = await getEvents();
  return [...new Set(events.map((e) => e.date.slice(0, 10)))].sort();
}

export async function getNews(): Promise<NewsArticle[]> {
  return [...NEWS].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
}

export async function getQuotes(): Promise<MarketQuote[]> {
  return QUOTES;
}

export async function getCurrencies(): Promise<CurrencyInfo[]> {
  return CURRENCIES;
}

export async function getCurrencyByCode(code: string): Promise<CurrencyInfo | null> {
  return CURRENCIES.find((c) => c.code === code.toUpperCase()) ?? null;
}

export async function getRelatedPairs(code: string): Promise<MarketQuote[]> {
  const upper = code.toUpperCase();
  return QUOTES.filter((q) => q.symbol.includes(upper));
}
