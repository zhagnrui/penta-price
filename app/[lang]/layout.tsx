import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { LOCALES, LOCALE_HTML_LANG, isValidLocale } from '@/lib/i18n/config'
import { getDictionary } from '@/lib/i18n/getDictionary'
import LanguageSwitcher from '@/components/LanguageSwitcher'
import type { Locale } from '@/lib/i18n/config'

const SITE_URL = 'https://www.pentaprice.com'

export function generateStaticParams() {
  return LOCALES.map(lang => ({ lang }))
}

type Props = {
  children: React.ReactNode
  params: Promise<{ lang: string }>
}

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params
  if (!isValidLocale(lang)) return {}
  const dict = await getDictionary(lang)

  return {
    title: dict.meta.title,
    description: dict.meta.description,
    alternates: {
      canonical: `${SITE_URL}/${lang}`,
      languages: {
        'zh': `${SITE_URL}/zh`,
        'en': `${SITE_URL}/en`,
        'de': `${SITE_URL}/de`,
        'x-default': `${SITE_URL}/zh`,
      },
    },
  }
}

export default async function LangLayout({ children, params }: Props) {
  const { lang } = await params
  if (!isValidLocale(lang)) notFound()

  const dict = await getDictionary(lang)
  const htmlLang = LOCALE_HTML_LANG[lang as Locale]

  // Schema.org structured data
  const schemaOrg = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': `${SITE_URL}/#website`,
        url: SITE_URL,
        name: 'PentaPrice',
        description: 'Weekly pentaerythritol price tracker — mono & di-PE, China EXW + global FOB/CIF.',
        inLanguage: ['zh-CN', 'en', 'de'],
      },
      {
        '@type': 'Dataset',
        '@id': `${SITE_URL}/#dataset`,
        name: 'Pentaerythritol Weekly Price Dataset · 季戊四醇周度价格数据集',
        description:
          'Weekly price data for mono-pentaerythritol (95%/98%) and dipentaerythritol: ' +
          'China domestic EXW (¥/t), FOB Qingdao (USD/t), and global CIF prices (US, EU, SEA). ' +
          'Updated every week.',
        url: SITE_URL,
        license: 'https://creativecommons.org/licenses/by-nc/4.0/',
        isAccessibleForFree: true,
        creator: { '@type': 'Organization', name: 'PentaPrice', url: SITE_URL },
        keywords: [
          'pentaerythritol price', 'dipentaerythritol price', '季戊四醇价格',
          '双季戊四醇', 'mono-PE', 'di-PE', 'FOB Qingdao', 'China chemical price',
          'Pentaerythritol Preis', 'PE Preis',
        ],
        temporalCoverage: '2024/2026',
        spatialCoverage: 'CN, US, EU, SEA',
        variableMeasured: [
          { '@type': 'PropertyValue', name: 'Mono-PE China EXW 95%', unitText: 'CNY/t' },
          { '@type': 'PropertyValue', name: 'Mono-PE China EXW 98%', unitText: 'CNY/t' },
          { '@type': 'PropertyValue', name: 'Mono-PE FOB Qingdao',   unitText: 'USD/t' },
          { '@type': 'PropertyValue', name: 'Di-PE Market Avg',       unitText: 'CNY/t' },
          { '@type': 'PropertyValue', name: 'US CIF pentaerythritol', unitText: 'USD/t' },
          { '@type': 'PropertyValue', name: 'EU CIF pentaerythritol', unitText: 'USD/t' },
        ],
      },
    ],
  }

  return (
    <>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaOrg) }}
        />
      </head>
      {/* Language switcher — top-right */}
      <div className="pe-lang-bar">
        <LanguageSwitcher current={lang as Locale} />
      </div>

      {children}

      <footer className="pe-footer">
        <div className="pe-footer-inner">
          <div className="pe-footer-brand">
            <span className="pe-footer-logo">{dict.footer.brand}</span>
            <span className="pe-footer-tagline">{dict.footer.tagline}</span>
          </div>
          <div className="pe-footer-contact">
            <a href="mailto:ryan139@gmail.com" className="pe-footer-email">
              📧 ryan139@gmail.com
            </a>
            <span className="pe-footer-note">{dict.footer.inquiries}</span>
          </div>
          <div className="pe-footer-copy">
            <span>© {new Date().getFullYear()} PentaPrice. {dict.footer.refOnly}</span>
            <span>{dict.footer.updated}</span>
          </div>
        </div>
      </footer>
    </>
  )
}
