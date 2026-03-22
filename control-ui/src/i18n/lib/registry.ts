import type { Locale, TranslationMap } from "./types.ts";

type BundledLocale = "vi" | "en";
type LazyLocale = Exclude<Locale, BundledLocale>;
type LocaleModule = Record<string, TranslationMap>;

type LazyLocaleRegistration = {
  exportName: string;
  loader: () => Promise<LocaleModule>;
};

/** Default UI language (first visit, unless navigator matches another supported locale). */
export const DEFAULT_LOCALE: Locale = "vi";

/** Always-loaded catalog used when a key is missing in the active locale. */
export const FALLBACK_LOCALE: Locale = "en";

const LAZY_LOCALES: readonly LazyLocale[] = ["zh-CN", "zh-TW", "pt-BR", "de", "es"];

const LAZY_LOCALE_REGISTRY: Record<LazyLocale, LazyLocaleRegistration> = {
  "zh-CN": {
    exportName: "zh_CN",
    loader: () => import("../locales/zh-CN.ts"),
  },
  "zh-TW": {
    exportName: "zh_TW",
    loader: () => import("../locales/zh-TW.ts"),
  },
  "pt-BR": {
    exportName: "pt_BR",
    loader: () => import("../locales/pt-BR.ts"),
  },
  de: {
    exportName: "de",
    loader: () => import("../locales/de.ts"),
  },
  es: {
    exportName: "es",
    loader: () => import("../locales/es.ts"),
  },
};

export const SUPPORTED_LOCALES: ReadonlyArray<Locale> = [
  DEFAULT_LOCALE,
  FALLBACK_LOCALE,
  ...LAZY_LOCALES,
];

export function isSupportedLocale(value: string | null | undefined): value is Locale {
  return value !== null && value !== undefined && SUPPORTED_LOCALES.includes(value as Locale);
}

export function isLazyLocale(locale: Locale): locale is LazyLocale {
  return LAZY_LOCALES.includes(locale as LazyLocale);
}

export function resolveNavigatorLocale(navLang: string): Locale {
  const lower = navLang.toLowerCase();
  if (lower.startsWith("vi")) {
    return "vi";
  }
  if (lower.startsWith("en")) {
    return "en";
  }
  if (navLang.startsWith("zh")) {
    return navLang === "zh-TW" || navLang === "zh-HK" ? "zh-TW" : "zh-CN";
  }
  if (navLang.startsWith("pt")) {
    return "pt-BR";
  }
  if (navLang.startsWith("de")) {
    return "de";
  }
  if (navLang.startsWith("es")) {
    return "es";
  }
  return DEFAULT_LOCALE;
}

export async function loadLazyLocaleTranslation(locale: Locale): Promise<TranslationMap | null> {
  if (!isLazyLocale(locale)) {
    return null;
  }
  const registration = LAZY_LOCALE_REGISTRY[locale];
  const module = await registration.loader();
  return module[registration.exportName] ?? null;
}
