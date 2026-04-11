import PriceDashboard from '@/components/PriceDashboard'

export const metadata = {
  title: 'Pentaerythritol Price Tracker | 季戊四醇价格行情周报',
  description: '实时追踪单季/双季戊四醇国内出厂价、FOB出口价及全球行情。每周更新，免费查询。Pentaerythritol weekly price tracker — mono & dipenta, China domestic + international FOB/CIF.',
  keywords: 'pentaerythritol price, 季戊四醇价格, dipentaerythritol price, 双季戊四醇行情, PENT price 2026',
}

export default function HomePage() {
  return <PriceDashboard />
}
