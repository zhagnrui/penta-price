// ─────────────────────────────────────────────────────
// 每周更新说明：
// 只需修改 currentWeek 对象中的数据
// history12w: 删除第一个数字，末尾加本周均价
// historyLabels: 同步更新周次标签
// ─────────────────────────────────────────────────────

export const currentWeek = {
  weekLabel: 'Week 15, 2026',
  updatedAt: '2026-04-10',

  mono: {
    domesticAvg: 11850,
    weekChange: 0,
    grade95: { low: 10000, high: 10500 },
    grade98: { low: 13500, high: 14000 },
    fobQingdao: 1520,
    regions: [
      { name: '华东 95%',    price: '10,000–10,400', trend: 'down' as const },
      { name: '华南 95%',    price: '10,200–10,600', trend: 'flat' as const },
      { name: '华北 98%',    price: '13,500–14,000', trend: 'up'   as const },
      { name: '内蒙出厂 98%', price: '13,200–13,800', trend: 'flat' as const },
      { name: 'FOB 青岛',    price: '$1,480–1,560',  trend: 'down' as const },
    ],
    news: [
      { text: '湖北宜化宜昌装置升级改造进入关键阶段，供给端关注度持续升温', tag: '供给', date: '2026-04-10' },
      { text: '甲醛原料价格本周小幅回落，对单季成本端形成短期压力', tag: '成本', date: '2026-04-10' },
      { text: '涂料下游春季开工率回升至78%，补库需求温和，价格承压但支撑稳固', tag: '需求', date: '2026-04-10' },
    ],
    history12w: [11200, 11400, 11100, 11600, 11800, 11500, 11900, 12100, 11850, 11700, 11900, 11850],
    historyLabels: ['W4','W5','W6','W7','W8','W9','W10','W11','W12','W13','W14','W15'],
  },

  di: {
    marketAvg: 62000,
    highEnd: 68000,
    fob: 8400,
    vsOct2024Pct: 175,
    supply: 1.8,
    demand: 2.5,
    history18m: [25000,28000,32000,35000,42000,55000,60000,62000,58000,61000,65000,63000,60000,64000,68000,66000,62000,62000],
    historyLabels: ['2024-10','11','12','2025-01','02','03','04','05','06','07','08','09','10','11','12','2026-01','02','03'],
    news: [
      { text: '双季供需缺口持续，PCB光固化油墨需求驱动高端报价持续支撑', tag: 'PCB需求', date: '2026-04-10' },
      { text: '湖北宜化内蒙新装置预计2025年底投产，届时双季产能有望增加', tag: '供给', date: '2026-04-10' },
    ],
  },

  intl: {
    us: 2090,
    europe: 2170,
    chinafob: 1520,
    sea: 1570,
    usChange: 22,
    euChange: 16,
    cnChange: -6,
    seaChange: -2,
    news: [
      { text: 'US market surged 22% MoM in March 2025, driven by tight supply amid Perstorp maintenance and tariff-driven front-loading.', tag: 'North America', date: '2026-04-10' },
      { text: '欧洲市场受德国汽车涂料需求支撑，德国报价连续两月上行，Q2预计维持高位震荡', tag: 'Europe', date: '2026-04-10' },
      { text: 'China FOB prices under pressure from oversupply; export competitiveness vs Russian suppliers remains challenged in European markets', tag: 'Asia export', date: '2026-04-10' },
    ],
    history: {
      labels: ['Q1 23','Q2 23','Q3 23','Q4 23','Q1 24','Q2 24','Q3 24','Q4 24','Q1 25','Q3 25','Q1 26'],
      us:  [1800,1750,2160,1900,1800,1850,2160,1900,2090,2090,2090],
      eu:  [1700,1650,1945,1800,1700,1700,1945,1820,2170,2000,2170],
      cn:  [1500,1450,1447,1400,1380,1530,1447,1380,1620,1500,1520],
      sea: [1450,1380,1400,1350,1320,1470,1400,1370,1570,1520,1570],
    },
  },
}
