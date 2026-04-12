import type { Metadata } from 'next'
import './globals.css'

const SITE_URL = 'https://www.pentaprice.com'

// Schema.org structured data — helps Google understand this is a price dataset
const schemaOrg = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebSite',
      '@id': `${SITE_URL}/#website`,
      url: SITE_URL,
      name: 'PentaPrice',
      description: 'Weekly pentaerythritol price tracker — mono & di-PE, China EXW + global FOB/CIF.',
      inLanguage: ['zh-CN', 'en'],
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
const OG_IMAGE = `${SITE_URL}/og-image.png`

export const metadata: Metadata = {
  title: 'PentaPrice · 季戊四醇价格行情周报',
  description:
    '实时追踪单季/双季季戊四醇国内出厂价、FOB出口价及全球行情，每周更新。' +
    'PentaPrice — weekly pentaerythritol price tracker: mono & di-PE, China EXW + global FOB/CIF.',
  keywords: [
    'pentaerythritol price', '季戊四醇价格', 'dipentaerythritol price',
    '双季戊四醇行情', 'penta price 2026', 'PE price China',
    'FOB Qingdao pentaerythritol', '季戊四醇出口价', 'PentaPrice',
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
    description: '单季/双季季戊四醇国内+国际价格，每周更新。Weekly mono & di-PE price tracker.',
    url: SITE_URL,
    siteName: 'PentaPrice',
    locale: 'zh_CN',
    type: 'website',
    images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: 'PentaPrice — Pentaerythritol Price Tracker' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PentaPrice · 季戊四醇价格行情',
    description: 'Weekly mono & di-PE prices — China domestic EXW + global FOB/CIF.',
    images: [OG_IMAGE],
  },
  alternates: { canonical: SITE_URL },
  verification: {
    other: { 'baidu-site-verification': ['codeva-ia559VlY6F'] },
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaOrg) }}
        />
      </head>
      <body>
        {children}
        <footer className="pe-footer">
          <div className="pe-footer-inner">
            <div className="pe-footer-brand">
              <span className="pe-footer-logo">PentaPrice · 季戊四醇价格行情</span>
              <span className="pe-footer-tagline">专业化工原料价格数据 · Chemical Price Intelligence</span>
            </div>
            <div className="pe-footer-contact">
              <a href="mailto:ryan139@gmail.com" className="pe-footer-email">
                📧 ryan139@gmail.com
              </a>
              <span className="pe-footer-note">询盘 &amp; 合作 · Inquiries &amp; partnerships</span>
            </div>
            <div className="pe-footer-copy">
              <span>© {new Date().getFullYear()} PentaPrice. 数据仅供参考 · For reference only.</span>
              <span>每周更新 · Updated weekly</span>
            </div>
          </div>
        </footer>
      </body>
    </html>
  )
}
