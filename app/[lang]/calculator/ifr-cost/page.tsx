import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { isValidLocale } from '@/lib/i18n/config'
import { getDictionary } from '@/lib/i18n/getDictionary'
import GeminiUIRefactor from '@/components/GeminiUIRefactor'

const SITE_URL = 'https://www.pentaprice.com'

type Props = { params: Promise<{ lang: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params
  if (!isValidLocale(lang)) return {}
  const dict = await getDictionary(lang)
  const tool = dict.calcIndex.tools.ifrCost
  return {
    title: `${tool.title} | PentaPrice`,
    description: tool.desc,
    keywords: [
      'IFR cost optimization', 'intumescent coating cost',
      'APP PER MEL price calculator', '防火涂料成本优化',
      'LOI prediction cost', 'PHRR formulation dashboard',
      '膨胀型阻燃成本仪表板', 'fire retardant cost breakdown',
    ],
    alternates: {
      canonical: `${SITE_URL}/${lang}/calculator/ifr-cost`,
      languages: {
        zh: `${SITE_URL}/zh/calculator/ifr-cost`,
        en: `${SITE_URL}/en/calculator/ifr-cost`,
        de: `${SITE_URL}/de/calculator/ifr-cost`,
      },
    },
  }
}

export default async function IFRCostPage({ params }: Props) {
  const { lang } = await params
  if (!isValidLocale(lang)) notFound()

  return <GeminiUIRefactor lang={lang} />
}
