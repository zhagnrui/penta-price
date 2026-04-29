const zh = {
  // ── Hero ─────────────────────────────────────────────
  hero: {
    title: 'PentaPrice · 季戊四醇价格行情',
    subtitle: '单季 / 双季 · 国内出厂 + 国际 FOB / CIF · 每周更新',
    thisWeek: '本周',
    updated: '更新于',
  },

  // ── Tabs ─────────────────────────────────────────────
  tabs: {
    mono: '单季戊四醇',
    di: '双季戊四醇',
    intl: '国际行情',
  },

  // ── Trend / change labels ─────────────────────────────
  change: {
    wow: '较上周',
    mom: '较上月',
    flat: '与上周持平',
    flatLabel: '— flat WoW / 与上周持平',
    pcbDriven: '▲ PCB-driven / PCB需求驱动',
    tightSupply: '— tight supply / 供货偏紧',
  },

  // ── Mono panel ───────────────────────────────────────
  mono: {
    domesticAvg: '国内均价',
    domesticAvgSub: 'Domestic avg (¥/t)',
    grade95: '95% 含量出厂含税',
    grade95Sub: '95% grade EXW incl. VAT (¥/t)',
    grade98: '98% 含量出厂含税',
    grade98Sub: '98% grade EXW incl. VAT (¥/t)',
    fobQingdao: 'FOB 青岛',
    fobQingdaoSub: 'FOB Qingdao (USD/t)',
    chartTitle: '单季戊四醇近12周价格走势 · Mono-PE 12-Week Price Trend',
    legendDomestic: '国内均价 Domestic (¥/t)',
    legendFob: 'FOB青岛×10 FOB Qingdao ×10 (ref.)',
    regionalTitle: '各地区报价参考 · Regional quotes',
    newsTitle: '本周市场快评 · Market commentary',
    regionHeader: '地区 / 规格 · Region / Grade',
    priceHeader: '价格 · Price',
    vatNote: '国内价格含 13% 增值税 · Domestic quotes include 13% VAT',
  },

  // ── Di panel ─────────────────────────────────────────
  di: {
    marketAvg: '市场均价',
    marketAvgSub: 'Market avg (¥/t)',
    highEnd: '高端报价上限',
    highEndSub: 'High-end ceiling (¥/t)',
    vsOct: '较2024年10月涨幅',
    vsOctSub: 'vs Oct 2024',
    fobExport: 'FOB 出口',
    fobExportSub: 'FOB export (USD/t)',
    trendTitle: '双季戊四醇 18 个月价格走势 · Di-PE 18-Month Price Trend',
    legendAvg: '均价 Avg',
    legendHighEnd: '高端 High-end',
    supplyTitle: '供需缺口 · Supply-Demand Gap (kt)',
    supplyLabel: 'Effective supply · 有效供给',
    demandLabel: 'Market demand · 市场需求',
    gapPrefix: 'Gap ≈',
    chartNote: '1 万吨 = 10 kt = 10,000 t · 时间口径待核实 / Timeframe TBD',
    newsTitle: '市场动态 · Market updates',
    momLabel: 'MoM / 较上月',
  },

  // ── International panel ───────────────────────────────
  intl: {
    usCif: '美国 CIF',
    usCifSub: 'USA CIF (USD/t)',
    euCif: '欧洲 (德国)',
    euCifSub: 'Europe DE (USD/t)',
    chinaFob: '中国 FOB',
    chinaFobSub: 'China FOB (USD/t)',
    seaCif: '东南亚 CIF',
    seaCifSub: 'SEA CIF (USD/t)',
    chartTitle: '全球主要市场价格对比 · Global Market Comparison (USD/t)',
    legendUS: '美国 USA',
    legendEU: '欧洲 Europe',
    legendCN: '中国FOB China FOB',
    legendSEA: '东南亚 SEA',
    newsTitle: '全球市场快评 · Global market commentary',
  },

  // ── Glossary ─────────────────────────────────────────
  glossary: {
    yPerT: '元/吨 RMB per metric ton',
    usdPerT: '美元/吨',
    kt: '1,000 吨 = 0.1 万吨',
    wow: 'Week-over-Week / 较上周',
    mom: 'Month-over-Month / 较上月',
    exw: 'Ex-Works / 出厂价',
    fob: 'Free on Board / 离岸价',
    cif: 'Cost Insurance & Freight / 到岸价',
  },

  // ── CTA ──────────────────────────────────────────────
  cta: {
    heading: '需要稳定高纯度季戊四醇供应？',
    headingEn: 'Need reliable high-purity pentaerythritol supply?',
    body: '98% / 95% 含量 · 大批量现货 · 出口单据齐全 · 技术支持',
    bodyEn: '98% / 95% grade · Bulk stock · Full export docs · Technical support',
    btn: '获取报价 / Get quote →',
  },

  // ── Inquiry modal ────────────────────────────────────
  inquiry: {
    modalTitle: '获取报价 · Request a Quote',
    modalSub: '填写后将打开您的邮件客户端 · Opens your email client on submit',
    close: '关闭',
    nameLbl: '姓名 Name',
    companyLbl: '公司 Company',
    industryLbl: '行业 Industry',
    gradeLbl: '需求规格 Grade',
    volumeLbl: '预计月用量 Monthly volume (吨/t)',
    contactLbl: '联系方式 Contact (email / WeChat)',
    notesLbl: '备注 Notes',
    namePlaceholder: '张三 / Zhang San',
    companyPlaceholder: 'XX化工有限公司',
    select: '请选择 / Please select',
    industries: [
      { value: 'Coatings', label: '涂料 / Coatings' },
      { value: 'Lubricants', label: '润滑油 / Lubricants' },
      { value: 'Antioxidants', label: '抗氧剂 / Antioxidants' },
      { value: 'Other', label: '其他 / Other' },
    ],
    grades: [
      { value: 'Mono-PE 95%', label: '单季 95% / Mono-PE 95%' },
      { value: 'Mono-PE 98%', label: '单季 98% / Mono-PE 98%' },
      { value: 'Di-PE', label: '双季 / Di-PE' },
    ],
    volumePlaceholder: 'e.g. 50',
    contactPlaceholder: 'email 或 微信号',
    notesPh: '交货地、包装要求、其他说明… / Delivery location, packaging…',
    disclaimer: '提交后将打开您默认邮件客户端，收件人已预填',
    cancelBtn: '取消 / Cancel',
    submitBtn: '发送询价 / Send inquiry →',
    thanksTitle: '邮件客户端已打开 / Email client opened',
    thanksBody: '请在邮件客户端中确认发送。我们将在 1 个工作日内回复。\nPlease confirm send in your email client. We reply within 1 business day.',
    closeBtn: '关闭 / Close',
    emailSubject: '季戊四醇询价 / Pentaerythritol Quote',
    mailLines: {
      name: '姓名 / Name',
      company: '公司 / Company',
      industry: '行业 / Industry',
      grade: '需求规格 / Grade',
      volume: '预计月用量 / Monthly volume',
      contact: '联系方式 / Contact (email/WeChat)',
      notes: '备注 / Notes',
    },
  },

  // ── Tools nav ─────────────────────────────────────────
  tools: {
    label: '🔧 计算工具 · Calculators',
    lubricant: '润滑油四酯收率',
    antioxidant: '抗氧剂1010投料',
    alkyd: '醇酸树脂配方',
    all: '全部工具 →',
  },

  // ── Calculator index page ─────────────────────────────
  calcIndex: {
    backToHome: '← 返回价格行情',
    freeBadge: '免费工具 · Free Tools',
    title: '化工计算工具箱',
    subtitle: 'Chemical Calculators · 季戊四醇产业链专业计算工具，数据实时同步当周市场行情',
    activeBadge: '已上线',
    useNow: '立即使用 →',
    footerNote: '📌 所有计算工具免费使用，无需注册。计算结果自动引用当周季戊四醇市场价格，仅供工程参考。实际生产投料应结合原料检测报告和工艺优化结果。如需当周原料报价，欢迎',
    footerLink: '返回首页查看行情',
    footerOr: '或直接联系我们。',
    tools: {
      lubricant: {
        title: '润滑油四酯收率计算器',
        titleEn: 'Lubricant Ester Yield Calculator',
        desc: '季戊四醇与脂肪酸酯化反应：计算四酯理论产量、脂肪酸用量、脱水量及PE原料成本。支持C5/C8/C9/C10及混合酸。',
        tags: ['润滑油', '多元醇酯', 'POE', 'C8 C10'],
      },
      antioxidant: {
        title: '抗氧剂1010投料计算器',
        titleEn: 'Antioxidant 1010 Batch Calculator',
        desc: '根据目标产量反算季戊四醇和MDHP中间体投料量，计算副产甲醇及PE原料成本（Irganox 1010合成工艺）。',
        tags: ['抗氧剂', 'Irganox 1010', 'MDHP', '塑料稳定剂'],
      },
      alkyd: {
        title: '醇酸树脂配方设计工具',
        titleEn: 'Alkyd Resin Design Tool',
        desc: '输入目标油长和产量，自动计算季戊四醇/甘油、苯酐、植物油用量，显示配方构成比例和预估酸值。',
        tags: ['醇酸树脂', '涂料', '油长', '苯酐'],
      },
      ifr: {
        title: '膨胀型防火涂料配比助手',
        titleEn: 'IFR Intumescent Fire Retardant Ratio Calculator',
        desc: '输入耐火极限和基材类型，自动给出 APP:PER:MEL "三位一体" 推荐比例，计算配套采购量并估算涂料产能。适用钢结构 / 木材 / 混凝土基材。',
        tags: ['防火涂料', 'IFR', 'APP', '三聚氰胺', '季戊四醇碳源'],
      },
      ifrPro: {
        title: '膨胀阻燃Pro配方优化器',
        titleEn: 'IFR Pro Advanced Formulation Optimizer',
        desc: '专业级性能预测与工艺分析：基于COA数据进行化学计量分析，预测LOI/PHRR/THRF性能指标，评估5大工艺风险，引用16+学术论文支持。适合工程设计、专利申请、批次对标。',
        tags: ['防火涂料Pro', '性能预测', '学术计算', 'LOI PHRR THRF', '工艺风险'],
      },
      ifrCost: {
        title: 'IFR成本优化仪表板',
        titleEn: 'Cost-Driven Formulation Dashboard',
        desc: '输入APP/PER/MEL用量与采购单价，实时计算成本分解、化学计量分析和性能预测（LOI/PHRR/THRF）。动态生成技术影响卡片与优化建议，帮助采购与技术团队共同决策最优配方。',
        tags: ['成本优化', 'LOI预测', '配方决策', 'APP PER MEL', '性价比分析'],
      },
    },
  },

  // ── Calculator shared strings ─────────────────────────
  calc: {
    inputs: '输入参数 · Inputs',
    results: '计算结果 · Results',
    reset: '重置 Reset',
    priceRefLink: '查看最新行情 →',
    backToCalc: '← 返回计算工具',
  },

  // ── Footer ────────────────────────────────────────────
  footer: {
    brand: 'PentaPrice · 季戊四醇价格行情',
    tagline: '专业化工原料价格数据 · Chemical Price Intelligence',
    inquiries: '询盘 & 合作 · Inquiries & partnerships',
    refOnly: '数据仅供参考 · For reference only.',
    updated: '每周更新 · Updated weekly',
  },

  // ── Nav / SEO ─────────────────────────────────────────
  nav: {
    backToQuotes: '← 返回价格行情',
  },

  // ── News (for locale-aware display) ──────────────────
  news: {
    readSource: '↗ 阅读原文 / Read source',
    noSourceLink: '· 暂无外链 / no source link',
  },

  // ── Meta ─────────────────────────────────────────────
  meta: {
    title: 'PentaPrice · 季戊四醇价格行情周报',
    description:
      '实时追踪单季/双季季戊四醇国内出厂价、FOB出口价及全球行情，每周更新。' +
      'PentaPrice — weekly pentaerythritol price tracker: mono & di-PE, China EXW + global FOB/CIF.',
    calcTitle: '化工计算工具箱 · Chemical Calculators | PentaPrice',
    calcDesc: '季戊四醇相关化工计算工具：润滑油四酯收率计算器、抗氧剂1010投料计算器、醇酸树脂配方设计工具。',
  },
}

export default zh
export type Dictionary = typeof zh
