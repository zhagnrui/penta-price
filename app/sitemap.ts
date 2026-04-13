import type { MetadataRoute } from 'next'
import { LOCALES } from '@/lib/i18n/config'
import { currentWeek } from '@/lib/priceData'

const SITE_URL = 'https://www.pentaprice.com'

const PAGES = ['', '/calculator', '/calculator/lubricant', '/calculator/antioxidant', '/calculator/alkyd']

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = []

  for (const locale of LOCALES) {
    for (const page of PAGES) {
      const isHome = page === ''
      entries.push({
        url: `${SITE_URL}/${locale}${page}`,
        lastModified: new Date(currentWeek.updatedAt),
        changeFrequency: isHome ? 'weekly' : 'monthly',
        priority: isHome ? 1.0 : page === '/calculator' ? 0.8 : 0.7,
        alternates: {
          languages: Object.fromEntries(
            LOCALES.map(l => [l, `${SITE_URL}/${l}${page}`])
          ),
        },
      })
    }

    // Weekly archive — current week only
    const weekSlug = currentWeek.weekLabel.replace(/,?\s+/g, '-').toLowerCase()
    entries.push({
      url: `${SITE_URL}/${locale}/weekly/${weekSlug}`,
      lastModified: new Date(currentWeek.updatedAt),
      changeFrequency: 'never',
      priority: 0.4,
    })
  }

  return entries
}
