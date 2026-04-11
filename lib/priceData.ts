// ─────────────────────────────────────────────────────
// Weekly update file / 每周更新文件
//
// Only edit `currentWeek`. See README "每周更新数据" section.
// 每个 news 条目建议补齐 url + source，便于读者溯源。
// ─────────────────────────────────────────────────────

export type Trend = 'up' | 'down' | 'flat'

export type NewsItem = {
  text: string          // 中文正文
  textEn?: string       // 英文正文（可选，缺省只显示中文）
  tag: string           // 中文标签
  tagEn?: string        // 英文标签（可选）
  date: string          // YYYY-MM-DD
  url?: string          // 新闻来源链接（可选，填了就变可点击）
  source?: string       // 来源机构名，如 "ICIS" / "卓创资讯"
}

export type Region = {
  name: string
  nameEn: string
  price: string
  trend: Trend
}

export const currentWeek = {
  weekLabel: 'Week 15, 2026',
  updatedAt: '2026-04-10',

  // ── 单季戊四醇 / Mono-Pentaerythritol ────────────────
  mono: {
    domesticAvg: 11850,        // ¥/t, China domestic avg
    weekChange: 0,             // ¥/t WoW
    grade95: { low: 10000, high: 10500 },
    grade98: { low: 13500, high: 14000 },
    fobQingdao: 1520,          // USD/t
    fobChangeMoM: -40,         // USD/t, Month-over-Month
    grade95ChangeWoW: -200,    // ¥/t
    grade98ChangeWoW: 100,     // ¥/t
    regions: [
      { name: '华东 95%',      nameEn: 'East China 95%',         price: '10,000–10,400', trend: 'down' },
      { name: '华南 95%',      nameEn: 'South China 95%',        price: '10,200–10,600', trend: 'flat' },
      { name: '华北 98%',      nameEn: 'North China 98%',        price: '13,500–14,000', trend: 'up'   },
      { name: '内蒙出厂 98%',  nameEn: 'Inner Mongolia EXW 98%', price: '13,200–13,800', trend: 'flat' },
      { name: 'FOB 青岛',      nameEn: 'FOB Qingdao (USD/t)',    price: '$1,480–1,560',  trend: 'down' },
    ] as Region[],
    news: [
      {
        text: '湖北宜化宜昌装置升级改造进入关键阶段，供给端关注度持续升温',
        textEn: 'Hubei Yihua Yichang plant upgrade enters a critical phase; supply-side attention is building.',
        tag: '供给', tagEn: 'Supply',
        date: '2026-04-10',
        url: '',           // TODO: 填入新闻源链接
        source: '',        // TODO: 填入来源机构
      },
      {
        text: '甲醛原料价格本周小幅回落，对单季成本端形成短期压力',
        textEn: 'Formaldehyde feedstock eased slightly this week, pressuring mono-PE cost support short-term.',
        tag: '成本', tagEn: 'Cost',
        date: '2026-04-10',
        url: '',
        source: '',
      },
      {
        text: '涂料下游春季开工率回升至78%，补库需求温和，价格承压但支撑稳固',
        textEn: 'Coatings downstream spring run-rate recovered to 78%; restocking demand is mild — prices pressured but supported.',
        tag: '需求', tagEn: 'Demand',
        date: '2026-04-10',
        url: '',
        source: '',
      },
    ] as NewsItem[],
    history12w: [11200, 11400, 11100, 11600, 11800, 11500, 11900, 12100, 11850, 11700, 11900, 11850],
    historyLabels: ['W4','W5','W6','W7','W8','W9','W10','W11','W12','W13','W14','W15'],
  },

  // ── 双季戊四醇 / Di-Pentaerythritol ──────────────────
  di: {
    marketAvg: 62000,        // ¥/t
    marketAvgChangeMoM: -3000, // ¥/t
    highEnd: 68000,          // ¥/t
    fob: 8400,               // USD/t
    // vs 2024-10 baseline
    baseline2024Oct: 22500,  // ¥/t baseline (so 22500 → 62000 ≈ +175%)
    vsOct2024Pct: 175,
    // 供需 / supply-demand, unit 万吨 (= 10 kt)
    // NOTE: confirm timeframe with next update (annual vs quarterly)
    supply: 1.8,             // 万吨 → 18 kt
    demand: 2.5,             // 万吨 → 25 kt
    history18m: [25000,28000,32000,35000,42000,55000,60000,62000,58000,61000,65000,63000,60000,64000,68000,66000,62000,62000],
    historyLabels: ['2024-10','11','12','2025-01','02','03','04','05','06','07','08','09','10','11','12','2026-01','02','03'],
    news: [
      {
        text: '双季供需缺口持续，PCB光固化油墨需求驱动高端报价持续支撑',
        textEn: 'Di-PE supply-demand gap persists; PCB photo-curable ink demand keeps premium quotes supported.',
        tag: 'PCB需求', tagEn: 'PCB demand',
        date: '2026-04-10',
        url: '',
        source: '',
      },
      {
        text: '湖北宜化内蒙新装置预计2025年底投产，届时双季产能有望增加',
        textEn: 'Hubei Yihua\'s new Inner Mongolia unit is expected online end-2025, adding di-PE capacity.',
        tag: '供给', tagEn: 'Supply',
        date: '2026-04-10',
        url: '',
        source: '',
      },
    ] as NewsItem[],
  },

  // ── 国际行情 / Global market ─────────────────────────
  intl: {
    us: 2090,          // USD/t, CIF
    europe: 2170,      // USD/t, DE
    chinafob: 1520,    // USD/t, FOB
    sea: 1570,         // USD/t, CIF
    usChange: 22,      // % MoM
    euChange: 16,      // % MoM
    cnChange: -6,      // % MoM
    seaChange: -2,     // % MoM
    news: [
      {
        text: '美国市场3月环比上涨22%，受Perstorp检修收紧供应 + 关税前抢货推动',
        textEn: 'US market surged 22% MoM in March 2025, driven by tight supply amid Perstorp maintenance and tariff-driven front-loading.',
        tag: '北美', tagEn: 'North America',
        date: '2026-04-10',
        url: '',
        source: '',
      },
      {
        text: '欧洲市场受德国汽车涂料需求支撑，德国报价连续两月上行，Q2预计维持高位震荡',
        textEn: 'Europe supported by German auto-coatings demand; DE quotes up two months in a row — expected to stay elevated through Q2.',
        tag: '欧洲', tagEn: 'Europe',
        date: '2026-04-10',
        url: '',
        source: '',
      },
      {
        text: '中国 FOB 报价受供应过剩压制；在欧洲市场面对俄罗斯货源的出口竞争力仍承压',
        textEn: 'China FOB prices under pressure from oversupply; export competitiveness vs Russian suppliers remains challenged in European markets.',
        tag: '亚洲出口', tagEn: 'Asia export',
        date: '2026-04-10',
        url: '',
        source: '',
      },
    ] as NewsItem[],
    history: {
      labels: ['Q1 23','Q2 23','Q3 23','Q4 23','Q1 24','Q2 24','Q3 24','Q4 24','Q1 25','Q3 25','Q1 26'],
      us:  [1800,1750,2160,1900,1800,1850,2160,1900,2090,2090,2090],
      eu:  [1700,1650,1945,1800,1700,1700,1945,1820,2170,2000,2170],
      cn:  [1500,1450,1447,1400,1380,1530,1447,1380,1620,1500,1520],
      sea: [1450,1380,1400,1350,1320,1470,1400,1370,1570,1520,1570],
    },
  },
}
