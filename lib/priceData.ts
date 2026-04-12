// ─────────────────────────────────────────────────────
// Weekly update file / 每周更新文件
//
// Only edit `currentWeek`. See README "每周更新数据" section.
// 每个 news 条目建议补齐 url + source，便于读者溯源。
// ─────────────────────────────────────────────────────

export type Trend = 'up' | 'down' | 'flat'

export type NewsItem = {
  // ── 标题行 ──
  text: string          // 中文一句话标题（≤60字）
  textEn?: string       // 英文一句话标题（可选）

  // ── 详情正文（展开阅读）──
  body?: string         // 中文正文段落，2–4 句，可换行用 \n
  bodyEn?: string       // 英文正文段落（可选）

  // ── 元信息 ──
  tag: string           // 中文标签
  tagEn?: string        // 英文标签
  date: string          // YYYY-MM-DD
  url?: string          // 新闻来源链接；填了就在底部出现 "↗ 阅读原文"
  source?: string       // 来源机构名，如 "ICIS" / "卓创资讯" / "公司公告"
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
        body: '宜化宜昌基地 3 万吨/年单季戊四醇装置自 3 月下旬进入升级改造，预计 5 月中旬复产。该装置占华中地区 95% 含量总产能约 22%，短期内华中现货供给边际收紧。下游贸易商反映提货周期已从 3 天延长至 7 天。',
        bodyEn: 'The 30 kt/y mono-PE line at Yihua\'s Yichang base entered a scheduled upgrade in late March and is expected to resume production in mid-May. The unit accounts for ~22% of 95% grade capacity in central China, tightening regional spot availability. Traders report lead times stretching from 3 to 7 days.',
        tag: '供给', tagEn: 'Supply',
        date: '2026-04-10',
        url: '',           // TODO: 填入新闻源链接
        source: '',        // TODO: 填入来源机构（如"卓创资讯"）
      },
      {
        text: '甲醛原料价格本周小幅回落，对单季成本端形成短期压力',
        textEn: 'Formaldehyde feedstock eased slightly this week, pressuring mono-PE cost support short-term.',
        body: '本周华东 37% 甲醛主流报价下调 40–60 元/吨至 1,280–1,340 元/吨，主因甲醇原料价格回调。甲醛在单季戊四醇成本结构中约占 45%，成本端支撑有所减弱，但目前现货报价尚未跟跌。',
        bodyEn: 'East China 37% formaldehyde fell ¥40–60/t this week to ¥1,280–1,340/t, tracking weaker methanol. Formaldehyde accounts for ~45% of mono-PE cost structure, so cost-side support has softened — though spot quotes haven\'t followed down yet.',
        tag: '成本', tagEn: 'Cost',
        date: '2026-04-10',
        url: '',
        source: '',
      },
      {
        text: '涂料下游春季开工率回升至78%，补库需求温和，价格承压但支撑稳固',
        textEn: 'Coatings downstream spring run-rate recovered to 78%; restocking demand is mild — prices pressured but supported.',
        body: '根据行业协会数据，华东涂料企业 4 月平均开工率回升至 78%，环比 +6 个百分点。下游补库以刚需为主，单笔采购量普遍在 5–10 吨，观望情绪较浓。预计 4 月下旬随家具/地产装修旺季到来，需求或有进一步改善。',
        bodyEn: 'East China coatings producers averaged 78% utilization in April, up 6 pp MoM per industry association data. Restocking is need-based with typical orders of 5–10 t; buyers remain cautious. Demand may firm further in late April alongside the furniture/renovation peak season.',
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
        body: '高端 90% 含量双季戊四醇主要用于 PCB 光固化油墨和高端醇酸树脂。2026 年一季度，国内 AI 服务器用高多层 PCB 订单同比 +35%，直接拉动高端双季需求。目前 90%+ 含量现货报价稳守 ¥68k/t 以上，部分贸易商惜售。',
        bodyEn: 'High-purity (90%+) di-pentaerythritol is primarily consumed by PCB photo-curable inks and high-end alkyd resins. China HDI PCB orders for AI servers rose ~35% YoY in Q1 2026, directly supporting premium di-PE demand. Spot quotes for 90%+ grade hold above ¥68k/t, with some traders holding back inventory.',
        tag: 'PCB需求', tagEn: 'PCB demand',
        date: '2026-04-10',
        url: '',
        source: '',
      },
      {
        text: '湖北宜化内蒙新装置预计2025年底投产，届时双季产能有望增加',
        textEn: 'Hubei Yihua\'s new Inner Mongolia unit is expected online end-2025, adding di-PE capacity.',
        body: '根据公司公告，宜化内蒙鄂尔多斯基地配套 1 万吨/年双季戊四醇装置已完成设备安装，预计 2025 年 12 月至 2026 年 1 月投料试车。该装置投产后将使国内有效产能增加约 12%，但短期内因爬坡期影响，供给改善有限。',
        bodyEn: 'Per company filings, Yihua\'s Ordos (Inner Mongolia) 10 kt/y di-PE unit has completed equipment installation and is scheduled for commissioning in Dec 2025 – Jan 2026. Once online it will add ~12% to domestic effective capacity, though ramp-up will limit near-term supply improvement.',
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
        body: 'Perstorp 瑞典工厂 3 月下旬开始为期 4 周的计划性检修，叠加美国客户在 "互惠关税" 生效前加速进口补库，USA CIF 报价从 $1,715/t 跳涨至 $2,090/t。亚洲出口商对美报价普遍调高 10–15%，部分订单推迟至 Q2 执行。',
        bodyEn: 'Perstorp\'s Swedish plant entered a scheduled 4-week turnaround in late March. Combined with US buyers front-loading imports ahead of reciprocal tariffs, USA CIF jumped from $1,715/t to $2,090/t. Asian exporters raised US offers 10–15%, with some orders deferred to Q2.',
        tag: '北美', tagEn: 'North America',
        date: '2026-04-10',
        url: '',
        source: '',
      },
      {
        text: '欧洲市场受德国汽车涂料需求支撑，德国报价连续两月上行，Q2预计维持高位震荡',
        textEn: 'Europe supported by German auto-coatings demand; DE quotes up two months in a row — expected to stay elevated through Q2.',
        body: '德国汽车 OEM 涂料需求自 2026 年初恢复，主流涂料厂商补库节奏加快，带动季戊四醇需求。德国 CIF 报价 2–3 月累计上涨 $170/t 至 $2,170/t。由于俄罗斯 Metafrax 对欧出口仍受制裁约束，欧洲本地供应偏紧格局短期难改。',
        bodyEn: 'German auto OEM coatings demand recovered from early 2026, with major coatings makers accelerating restocking and lifting pentaerythritol demand. German CIF climbed $170/t across Feb–Mar to $2,170/t. With Russian Metafrax exports to Europe still restricted by sanctions, local tightness is unlikely to ease near-term.',
        tag: '欧洲', tagEn: 'Europe',
        date: '2026-04-10',
        url: '',
        source: '',
      },
      {
        text: '中国 FOB 报价受供应过剩压制；在欧洲市场面对俄罗斯货源的出口竞争力仍承压',
        textEn: 'China FOB prices under pressure from oversupply; export competitiveness vs Russian suppliers remains challenged in European markets.',
        body: '一季度中国季戊四醇出口量同比 -8%，主因欧洲买家更倾向于从哈萨克斯坦/土耳其中转的俄罗斯货源，价差达 $120–180/t。中国 FOB 青岛报价已下行至 $1,520/t，但出口利润空间被海运费回升进一步压缩。出口商正转向东南亚和中东市场。',
        bodyEn: 'China\'s pentaerythritol exports fell 8% YoY in Q1 as European buyers favored Russian material routed via Kazakhstan/Türkiye, at a $120–180/t discount. China FOB Qingdao slipped to $1,520/t, while rising freight further squeezes export margins. Exporters are pivoting toward Southeast Asia and the Middle East.',
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
