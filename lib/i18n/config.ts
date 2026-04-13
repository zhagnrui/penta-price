export const LOCALES = ['zh', 'en', 'de'] as const
export type Locale = (typeof LOCALES)[number]
export const DEFAULT_LOCALE: Locale = 'zh'

export function isValidLocale(lang: string): lang is Locale {
  return (LOCALES as readonly string[]).includes(lang)
}

export const LOCALE_LABELS: Record<Locale, string> = {
  zh: '中文',
  en: 'English',
  de: 'Deutsch',
}

export const LOCALE_HTML_LANG: Record<Locale, string> = {
  zh: 'zh-CN',
  en: 'en',
  de: 'de',
}
