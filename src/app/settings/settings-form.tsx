"use client";

import { useState } from "react";
import { Check, Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLocalStorageValue } from "@/lib/use-local-storage";

const TIMEZONES = ["UTC", "America/New_York", "Europe/London", "Europe/Berlin", "Asia/Tokyo", "Australia/Sydney"];
const IMPACTS = [
  { value: "all", label: "Show all events" },
  { value: "high", label: "High impact only" },
  { value: "medium", label: "Medium and above" },
];
const CURRENCIES = ["USD", "EUR", "JPY", "GBP", "AUD", "CAD", "CHF", "NZD"];

function parseFavorites(raw: string | null): string[] {
  if (!raw) return ["USD", "EUR"];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((c) => CURRENCIES.includes(c)) : ["USD", "EUR"];
  } catch {
    return ["USD", "EUR"];
  }
}

export default function SettingsForm() {
  const storedTheme = useLocalStorageValue("fn-theme");
  const storedTz = useLocalStorageValue("fn-timezone");
  const storedImpact = useLocalStorageValue("fn-impact");
  const storedFavorites = useLocalStorageValue("fn-favorites");

  const [themeOverride, setThemeOverride] = useState<"dark" | "light" | null>(null);
  const [tzOverride, setTzOverride] = useState<string | null>(null);
  const [impactOverride, setImpactOverride] = useState<string | null>(null);
  const [favOverride, setFavOverride] = useState<string[] | null>(null);
  const [saved, setSaved] = useState(false);

  const theme = themeOverride ?? (storedTheme === "light" ? "light" : "dark");
  const timeZone = tzOverride ?? (storedTz && TIMEZONES.includes(storedTz) ? storedTz : "UTC");
  const impact =
    impactOverride ?? (storedImpact && IMPACTS.some((i) => i.value === storedImpact) ? storedImpact : "all");
  const favorites = favOverride ?? parseFavorites(storedFavorites);

  function applyTheme(next: "dark" | "light") {
    setThemeOverride(next);
    document.documentElement.classList.toggle("dark", next === "dark");
  }

  function toggleFavorite(code: string) {
    setFavOverride(
      favorites.includes(code)
        ? favorites.filter((c) => c !== code)
        : [...favorites, code]
    );
  }

  function save() {
    try {
      localStorage.setItem("fn-theme", theme);
      localStorage.setItem("fn-timezone", timeZone);
      localStorage.setItem("fn-impact", impact);
      localStorage.setItem("fn-favorites", JSON.stringify(favorites));
    } catch {
      // storage unavailable
    }
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div className="space-y-6">
      <section className="rounded-xl border border-border bg-surface p-6">
        <h2 className="mb-1 font-semibold">Appearance</h2>
        <p className="mb-4 text-sm text-muted">Choose between light and dark mode.</p>
        <div className="flex gap-2">
          {(
            [
              { value: "light", label: "Light", icon: Sun },
              { value: "dark", label: "Dark", icon: Moon },
            ] as const
          ).map(({ value, label, icon: Icon }) => (
            <button
              key={value}
              onClick={() => applyTheme(value)}
              className={cn(
                "flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition-colors",
                theme === value
                  ? "border-brand bg-brand/10 text-brand"
                  : "border-border text-muted hover:text-foreground"
              )}
            >
              <Icon size={15} /> {label}
            </button>
          ))}
        </div>
      </section>

      <section className="rounded-xl border border-border bg-surface p-6">
        <h2 className="mb-1 font-semibold">Timezone</h2>
        <p className="mb-4 text-sm text-muted">
          Used to display event times across the calendar.
        </p>
        <select
          value={timeZone}
          onChange={(e) => setTzOverride(e.target.value)}
          className="h-10 w-full max-w-xs rounded-lg border border-border bg-surface px-3 text-sm outline-none focus:border-brand"
        >
          {TIMEZONES.map((tz) => (
            <option key={tz} value={tz}>
              {tz.replace("_", " ")}
            </option>
          ))}
        </select>
      </section>

      <section className="rounded-xl border border-border bg-surface p-6">
        <h2 className="mb-1 font-semibold">Default Impact Filter</h2>
        <p className="mb-4 text-sm text-muted">
          Applied automatically when you open the calendar.
        </p>
        <div className="flex flex-col gap-2">
          {IMPACTS.map((i) => (
            <label key={i.value} className="flex cursor-pointer items-center gap-2 text-sm">
              <input
                type="radio"
                name="impact"
                value={i.value}
                checked={impact === i.value}
                onChange={() => setImpactOverride(i.value)}
                className="accent-brand"
              />
              {i.label}
            </label>
          ))}
        </div>
      </section>

      <section className="rounded-xl border border-border bg-surface p-6">
        <h2 className="mb-1 font-semibold">Favorite Currencies</h2>
        <p className="mb-4 text-sm text-muted">Highlight the currencies you trade most.</p>
        <div className="flex flex-wrap gap-2">
          {CURRENCIES.map((c) => (
            <button
              key={c}
              onClick={() => toggleFavorite(c)}
              className={cn(
                "rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors",
                favorites.includes(c)
                  ? "border-brand bg-brand/10 text-brand"
                  : "border-border text-muted hover:text-foreground"
              )}
            >
              {c}
            </button>
          ))}
        </div>
      </section>

      <div className="flex items-center gap-3">
        <button
          onClick={save}
          className="rounded-lg bg-brand px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-dark"
        >
          Save preferences
        </button>
        {saved && (
          <span className="flex items-center gap-1 text-sm font-medium text-up">
            <Check size={15} /> Saved
          </span>
        )}
      </div>
    </div>
  );
}
