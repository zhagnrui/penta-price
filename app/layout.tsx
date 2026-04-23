import type { Metadata } from 'next'
import './globals.css'

const SITE_URL = 'https://www.pentaprice.com'
const OG_IMAGE = `${SITE_URL}/og-image.png`

export const metadata: Metadata = {
  title: {
    default: 'PentaPrice · 季戊四醇价格行情',
    template: '%s | PentaPrice',
  },
  description:
    'Weekly pentaerythritol price tracker: mono & di-PE, China EXW + global FOB/CIF. ' +
    '实时追踪季戊四醇国内出厂价、FOB出口价及全球行情，每周更新。',
  keywords: [
    'pentaerythritol price', '季戊四醇价格', 'dipentaerythritol price',
    '双季戊四醇行情', 'penta price 2026', 'PE price China',
    'FOB Qingdao pentaerythritol', 'Pentaerythritol Preis',
  ],
  authors: [{ name: 'PentaPrice' }],
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: '/apple-touch-icon.png',
  },
  openGraph: {
    title: 'PentaPrice · 季戊四醇价格行情',
    description: 'Weekly mono & di-PE price tracker — China domestic EXW + global FOB/CIF.',
    url: SITE_URL,
    siteName: 'PentaPrice',
    type: 'website',
    images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: 'PentaPrice — Pentaerythritol Price Tracker' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PentaPrice · 季戊四醇价格行情',
    description: 'Weekly mono & di-PE prices — China domestic EXW + global FOB/CIF.',
    images: [OG_IMAGE],
  },
  alternates: {
    canonical: SITE_URL,
    languages: {
      'zh': `${SITE_URL}/zh`,
      'en': `${SITE_URL}/en`,
      'de': `${SITE_URL}/de`,
      'x-default': `${SITE_URL}/zh`,
    },
  },
  verification: {
    other: { 'baidu-site-verification': ['codeva-ia559VlY6F'] },
  },
}

// Root layout: provides html/body structure for all pages
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
