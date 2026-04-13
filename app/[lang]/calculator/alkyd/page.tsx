import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { isValidLocale } from '@/lib/i18n/config'
import { getDictionary } from '@/lib/i18n/getDictionary'
import AlkydCalc from '@/components/AlkydCalc'

const SITE_URL = 'https://www.pentaprice.com'

type Props = { params: Promise<{ lang: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params
  if (!isValidLocale(lang)) return {}
  const dict = await getDictionary(lang)
  const tool = dict.calcIndex.tools.alkyd
  return {
    title: `${tool.title} | PentaPrice`,
    description: tool.desc,
    alternates: {
      canonical: `${SITE_URL}/${lang}/calculator/alkyd`,
      languages: {
        zh: `${SITE_URL}/zh/calculator/alkyd`,
        en: `${SITE_URL}/en/calculator/alkyd`,
        de: `${SITE_URL}/de/calculator/alkyd`,
      },
    },
  }
}

export default async function AlkydPage({ params }: Props) {
  const { lang } = await params
  if (!isValidLocale(lang)) notFound()
  const dict = await getDictionary(lang)
  const tool = dict.calcIndex.tools.alkyd

  return (
    <main className="pe-main">
      <div style={{ marginBottom: '1rem' }}>
        <Link href={`/${lang}/calculator`} style={{ color: 'var(--pe-green)', textDecoration: 'none', fontSize: '13px', fontWeight: 600 }}>
          {dict.calc.backToCalc}
        </Link>
      </div>
      <div className="pe-hero" style={{ marginBottom: '1.5rem' }}>
        <div>
          <div style={{ fontSize: '28px', marginBottom: '6px' }}>🎨</div>
          <h1 style={{ fontSize: '20px', fontWeight: 700, margin: '0 0 4px', color: 'var(--pe-text-main)' }}>
            {tool.title}
          </h1>
          <p style={{ fontSize: '13px', color: 'var(--pe-text-muted)', margin: 0 }}>
            {tool.desc}
          </p>
        </div>
      </div>
      <AlkydCalc lang={lang} dict={dict} />
    </main>
  )
}
