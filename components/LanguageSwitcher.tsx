'use client'

import { usePathname, useRouter } from 'next/navigation'
import { LOCALES, LOCALE_LABELS, isValidLocale } from '@/lib/i18n/config'
import type { Locale } from '@/lib/i18n/config'

export default function LanguageSwitcher({ current }: { current: Locale }) {
  const pathname = usePathname()
  const router = useRouter()

  function switchLocale(next: Locale) {
    if (next === current) return

    // Replace first segment (locale) in pathname: /zh/calculator → /de/calculator
    const segments = pathname.split('/')
    if (segments[1] && isValidLocale(segments[1])) {
      segments[1] = next
    } else {
      segments.splice(1, 0, next)
    }
    const newPath = segments.join('/') || `/${next}`

    // Save preference in cookie (1 year)
    document.cookie = `pe-locale=${next};path=/;max-age=31536000;samesite=lax`
    router.push(newPath)
  }

  return (
    <div className="pe-lang-switcher" aria-label="Language switcher">
      {LOCALES.map(locale => (
        <button
          key={locale}
          onClick={() => switchLocale(locale)}
          className={`pe-lang-btn${locale === current ? ' pe-lang-btn-active' : ''}`}
          aria-current={locale === current ? 'true' : undefined}
          type="button"
        >
          {LOCALE_LABELS[locale]}
        </button>
      ))}
    </div>
  )
}
