import { notFound } from 'next/navigation'
import { isValidLocale } from '@/lib/i18n/config'
import { getDictionary } from '@/lib/i18n/getDictionary'
import PriceDashboard from '@/components/PriceDashboard'

type Props = {
  params: Promise<{ lang: string }>
}

export default async function HomePage({ params }: Props) {
  const { lang } = await params
  if (!isValidLocale(lang)) notFound()

  const dict = await getDictionary(lang)
  return <PriceDashboard lang={lang} dict={dict} />
}
