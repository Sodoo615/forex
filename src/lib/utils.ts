import type { Impact } from "./types";

export function cn(...classes: (string | false | null | undefined)[]): string {
  return classes.filter(Boolean).join(" ");
}

export function formatDayLabel(isoDate: string): string {
  const d = new Date(isoDate + "T00:00:00Z");
  return new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  }).format(d);
}

export function formatEventTime(iso: string, timeZone: string): string {
  try {
    return new Intl.DateTimeFormat("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
      timeZone,
    })
      .format(new Date(iso))
      .toLowerCase();
  } catch {
    return new Intl.DateTimeFormat("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
      timeZone: "UTC",
    })
      .format(new Date(iso))
      .toLowerCase();
  }
}

export function formatFullDate(iso: string, timeZone = "UTC"): string {
  try {
    return new Intl.DateTimeFormat("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
      timeZoneName: "short",
      timeZone,
    }).format(new Date(iso));
  } catch {
    return new Intl.DateTimeFormat("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
      timeZoneName: "short",
      timeZone: "UTC",
    }).format(new Date(iso));
  }
}

export function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
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
