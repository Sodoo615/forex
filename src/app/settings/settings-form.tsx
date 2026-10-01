"use client";

import { useState } from "react";
import { Check, Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLocalStorageValue } from "@/lib/use-local-storage";
import { useLang } from "@/lib/i18n/language-context";

const TIMEZONES = ["UTC", "America/New_York", "Europe/London", "Europe/Berlin", "Asia/Tokyo", "Australia/Sydney"];
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
  const { lang, setLang, t } = useLang();
  const IMPACTS = [
    { value: "all", label: t.settings.showAll },
    { value: "high", label: t.settings.highOnly },
    { value: "medium", label: t.settings.mediumAbove },
  ];
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
    <div>
      <h1 className="mb-1 text-2xl font-bold tracking-tight sm:text-3xl">{t.settings.title}</h1>
      <p className="mb-6 text-muted">{t.settings.subtitle}</p>
      <div className="space-y-6">
      <section className="rounded-xl border border-border bg-surface p-6">
        <h2 className="mb-1 font-semibold">{t.settings.language}</h2>
        <p className="mb-4 text-sm text-muted">{t.settings.languageDesc}</p>
        <div className="flex gap-2">
          {(
            [
              { value: "en", label: t.language.en },
              { value: "mn", label: t.language.mn },
            ] as const
          ).map(({ value, label }) => (
            <button
              key={value}
              onClick={() => setLang(value)}
              className={cn(
                "flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition-colors",
                lang === value
                  ? "border-brand bg-brand/10 text-brand"
                  : "border-border text-muted hover:text-foreground"
              )}
            >
              {label}
            </button>
          ))}
        </div>
      </section>

      <section className="rounded-xl border border-border bg-surface p-6">
        <h2 className="mb-1 font-semibold">{t.settings.appearance}</h2>
        <p className="mb-4 text-sm text-muted">{t.settings.appearanceDesc}</p>
        <div className="flex gap-2">
          {(
            [
              { value: "light", label: t.settings.light, icon: Sun },
              { value: "dark", label: t.settings.dark, icon: Moon },
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
        <h2 className="mb-1 font-semibold">{t.settings.timezone}</h2>
        <p className="mb-4 text-sm text-muted">
          {t.settings.timezoneDesc}
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
        <h2 className="mb-1 font-semibold">{t.settings.defaultImpact}</h2>
        <p className="mb-4 text-sm text-muted">
          {t.settings.defaultImpactDesc}
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
        <h2 className="mb-1 font-semibold">{t.settings.favorites}</h2>
        <p className="mb-4 text-sm text-muted">{t.settings.favoritesDesc}</p>
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
          {t.settings.save}
        </button>
        {saved && (
          <span className="flex items-center gap-1 text-sm font-medium text-up">
            <Check size={15} /> {t.settings.saved}
          </span>
        )}
      </div>
      </div>
    </div>
  );
}
