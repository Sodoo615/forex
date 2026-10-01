import type { Lang } from "./i18n/config";
import type { Dictionary } from "./i18n/dictionaries";
import type { Impact } from "./types";

export function cn(...classes: (string | false | null | undefined)[]): string {
  return classes.filter(Boolean).join(" ");
}

// Browsers don't reliably bundle ICU data for "mn-MN" (unlike most major
// locales), so Intl silently falls back to English formatting. Mongolian
// output is built manually from locale-independent numeric parts instead.

const MN_WEEKDAY_SHORT: Record<string, string> = {
  Sun: "Ня", Mon: "Да", Tue: "Мя", Wed: "Лх", Thu: "Пү", Fri: "Ба", Sat: "Бя",
};

const MN_WEEKDAY_LONG: Record<string, string> = {
  Sunday: "Ням",
  Monday: "Даваа",
  Tuesday: "Мягмар",
  Wednesday: "Лхагва",
  Thursday: "Пүрэв",
  Friday: "Баасан",
  Saturday: "Бямба",
};

const MONTH_NUMBER: Record<string, number> = {
  Jan: 1, Feb: 2, Mar: 3, Apr: 4, May: 5, Jun: 6,
  Jul: 7, Aug: 8, Sep: 9, Oct: 10, Nov: 11, Dec: 12,
};

function part(parts: Intl.DateTimeFormatPart[], type: Intl.DateTimeFormatPartTypes): string {
  return parts.find((p) => p.type === type)?.value ?? "";
}

export function formatDayLabel(isoDate: string, lang?: Lang): string {
  const d = new Date(isoDate + "T00:00:00Z");
  const parts = new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  }).formatToParts(d);

  if (lang !== "mn") {
    return `${part(parts, "weekday")}, ${part(parts, "month")} ${part(parts, "day")}`;
  }
  const weekday = MN_WEEKDAY_SHORT[part(parts, "weekday")] ?? part(parts, "weekday");
  const month = MONTH_NUMBER[part(parts, "month")] ?? part(parts, "month");
  return `${weekday}, ${month}-р сарын ${part(parts, "day")}`;
}

export function formatEventTime(iso: string, timeZone: string, lang?: Lang): string {
  const date = new Date(iso);
  const safeTimeZone = (() => {
    try {
      new Intl.DateTimeFormat("en-US", { timeZone });
      return timeZone;
    } catch {
      return "UTC";
    }
  })();

  if (lang === "mn") {
    return new Intl.DateTimeFormat("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: false,
      timeZone: safeTimeZone,
    }).format(date);
  }

  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    timeZone: safeTimeZone,
  })
    .format(date)
    .toLowerCase();
}

export function formatFullDate(iso: string, timeZone = "UTC", lang?: Lang): string {
  const date = new Date(iso);
  const safeTimeZone = (() => {
    try {
      new Intl.DateTimeFormat("en-US", { timeZone });
      return timeZone;
    } catch {
      return "UTC";
    }
  })();

  if (lang !== "mn") {
    return new Intl.DateTimeFormat("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
      timeZoneName: "short",
      timeZone: safeTimeZone,
    }).format(date);
  }

  const parts = new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: false,
    timeZoneName: "short",
    timeZone: safeTimeZone,
  }).formatToParts(date);

  const weekday = MN_WEEKDAY_LONG[part(parts, "weekday")] ?? part(parts, "weekday");
  const month = MONTH_NUMBER[part(parts, "month")] ?? part(parts, "month");
  const tz = part(parts, "timeZoneName");
  return `${part(parts, "year")} оны ${month}-р сарын ${part(parts, "day")}, ${weekday} гариг, ${part(parts, "hour")}:${part(parts, "minute")} (${tz})`;
}

export function timeAgo(iso: string, t: Dictionary["time"]): string {
  const diff = Date.now() - new Date(iso).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return t.justNow;
  if (minutes < 60) return t.minutesAgo.replace("{n}", String(minutes));
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return t.hoursAgo.replace("{n}", String(hours));
  const days = Math.floor(hours / 24);
  return t.daysAgo.replace("{n}", String(days));
}

export const IMPACT_STYLES: Record<Impact, { label: string; className: string }> = {
  high: { label: "High", className: "bg-red-500/15 text-red-600 dark:text-red-400" },
  medium: { label: "Med", className: "bg-orange-500/15 text-orange-600 dark:text-orange-400" },
  low: { label: "Low", className: "bg-yellow-500/15 text-yellow-600 dark:text-yellow-400" },
  holiday: { label: "Holiday", className: "bg-slate-500/15 text-slate-500 dark:text-slate-400" },
};

export function utcDayKey(offsetDays = 0): string {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() + offsetDays);
  return d.toISOString().slice(0, 10);
}
