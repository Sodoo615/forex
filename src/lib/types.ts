export type Impact = "high" | "medium" | "low" | "holiday";

export interface EconomicEvent {
  id: string;
  /** ISO 8601 datetime in UTC */
  date: string;
  currency: string;
  impact: Impact;
  title: string;
  actual: string | null;
  forecast: string | null;
  previous: string | null;
  description: string;
  source: string;
  measures: string;
  usualEffect: string;
  frequency: string;
}

export interface NewsArticle {
  id: string;
  title: string;
  summary: string;
  body: string[];
  source: string;
  category: "Analysis" | "Breaking" | "Central Banks" | "Geopolitics" | "Technical" | "Education";
  publishedAt: string;
  readMinutes: number;
}

export interface MarketQuote {
  symbol: string;
  name: string;
  bid: number;
  ask: number;
  change: number;
  changePct: number;
  dayHigh: number;
  dayLow: number;
  decimals: number;
  sparkline: number[];
}

export interface CurrencyInfo {
  code: string;
  name: string;
  nation: string;
  centralBank: string;
  interestRate: string;
  nickname: string;
  description: string;
}

export interface CalendarDay {
  /** ISO date (yyyy-mm-dd) of the day in UTC */
  date: string;
  events: EconomicEvent[];
}
