import type { Locale } from './config'
import type { Dictionary } from './dictionaries/zh'

const dictionaries: Record<Locale, () => Promise<{ default: Dictionary }>> = {
  zh: () => import('./dictionaries/zh'),
  en: () => import('./dictionaries/en'),
  de: () => import('./dictionaries/de'),
}

export async function getDictionary(locale: Locale): Promise<Dictionary> {
  const mod = await dictionaries[locale]()
  return mod.default
}
