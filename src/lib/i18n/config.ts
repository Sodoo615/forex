export const LOCALES = ["en", "mn"] as const;
export type Lang = (typeof LOCALES)[number];
export const DEFAULT_LANG: Lang = "en";

export function isLang(value: string): value is Lang {
  return (LOCALES as readonly string[]).includes(value);
}

export function langPath(lang: Lang, path: string): string {
  return `/${lang}${path === "/" ? "" : path}`;
}
