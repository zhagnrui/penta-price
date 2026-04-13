import type { Dictionary } from './zh'

const en: Dictionary = {
  hero: {
    title: 'PentaPrice · Pentaerythritol Market Prices',
    subtitle: 'Mono & Di-PE · China EXW + Global FOB / CIF · Updated weekly',
    thisWeek: 'This week',
    updated: 'Updated',
  },

  tabs: {
    mono: 'Mono-PE',
    di: 'Di-PE',
    intl: 'Global Markets',
  },

  change: {
    wow: 'WoW',
    mom: 'MoM',
    flat: 'flat WoW',
    flatLabel: '— flat WoW',
    pcbDriven: '▲ PCB-driven',
    tightSupply: '— tight supply',
  },

  mono: {
    domesticAvg: 'Domestic Avg',
    domesticAvgSub: 'China EXW average (¥/t)',
    grade95: '95% Grade EXW',
    grade95Sub: 'Ex-works incl. VAT (¥/t)',
    grade98: '98% Grade EXW',
    grade98Sub: 'Ex-works incl. VAT (¥/t)',
    fobQingdao: 'FOB Qingdao',
    fobQingdaoSub: 'USD/t',
    chartTitle: 'Mono-PE 12-Week Price Trend',
    legendDomestic: 'China domestic avg (¥/t)',
    legendFob: 'FOB Qingdao ×10 (USD/t, ref.)',
    regionalTitle: 'Regional Quotes',
    newsTitle: 'Market Commentary',
    regionHeader: 'Region / Grade',
    priceHeader: 'Price',
    vatNote: 'Domestic prices include 13% VAT',
  },

  di: {
    marketAvg: 'Market Avg',
    marketAvgSub: '¥/t',
    highEnd: 'High-End Ceiling',
    highEndSub: '¥/t',
    vsOct: 'vs Oct 2024',
    vsOctSub: 'year-over-year comparison',
    fobExport: 'FOB Export',
    fobExportSub: 'USD/t',
    trendTitle: 'Di-PE 18-Month Price Trend',
    legendAvg: 'Avg',
    legendHighEnd: 'High-end',
    supplyTitle: 'Supply-Demand Gap (kt)',
    supplyLabel: 'Effective supply',
    demandLabel: 'Market demand',
    gapPrefix: 'Gap ≈',
    chartNote: '1 万吨 = 10 kt = 10,000 t · Timeframe TBD',
    newsTitle: 'Market Updates',
    momLabel: 'MoM',
  },

  intl: {
    usCif: 'USA CIF',
    usCifSub: 'USD/t',
    euCif: 'Europe (DE)',
    euCifSub: 'USD/t',
    chinaFob: 'China FOB',
    chinaFobSub: 'USD/t',
    seaCif: 'SE Asia CIF',
    seaCifSub: 'USD/t',
    chartTitle: 'Global Market Price Comparison (USD/t)',
    legendUS: 'USA',
    legendEU: 'Europe',
    legendCN: 'China FOB',
    legendSEA: 'SE Asia',
    newsTitle: 'Global Market Commentary',
  },

  glossary: {
    yPerT: 'Yuan (RMB) per metric ton',
    usdPerT: 'US Dollar per metric ton',
    kt: '1,000 metric tons',
    wow: 'Week-over-Week change',
    mom: 'Month-over-Month change',
    exw: 'Ex-Works (factory gate price)',
    fob: 'Free on Board',
    cif: 'Cost, Insurance & Freight',
  },

  cta: {
    heading: 'Need reliable high-purity pentaerythritol supply?',
    headingEn: '',
    body: '98% / 95% grade · Bulk stock · Full export docs · Technical support',
    bodyEn: '',
    btn: 'Request a quote →',
  },

  inquiry: {
    modalTitle: 'Request a Quote',
    modalSub: 'Your email client opens on submit',
    close: 'Close',
    nameLbl: 'Name',
    companyLbl: 'Company',
    industryLbl: 'Industry',
    gradeLbl: 'Grade required',
    volumeLbl: 'Est. monthly volume (t)',
    contactLbl: 'Contact (email / WeChat)',
    notesLbl: 'Notes',
    namePlaceholder: 'Your name',
    companyPlaceholder: 'Company name',
    select: 'Please select',
    industries: [
      { value: 'Coatings', label: 'Coatings / Paints' },
      { value: 'Lubricants', label: 'Lubricants / POE' },
      { value: 'Antioxidants', label: 'Antioxidants' },
      { value: 'Other', label: 'Other' },
    ],
    grades: [
      { value: 'Mono-PE 95%', label: 'Mono-PE 95%' },
      { value: 'Mono-PE 98%', label: 'Mono-PE 98%' },
      { value: 'Di-PE', label: 'Di-PE (dipentaerythritol)' },
    ],
    volumePlaceholder: 'e.g. 50',
    contactPlaceholder: 'email or WeChat ID',
    notesPh: 'Delivery location, packaging requirements, other notes…',
    disclaimer: 'On submit your default email client opens, pre-addressed to',
    cancelBtn: 'Cancel',
    submitBtn: 'Send inquiry →',
    thanksTitle: 'Email client opened',
    thanksBody: 'Please confirm send in your email client. We reply within 1 business day.',
    closeBtn: 'Close',
    emailSubject: 'Pentaerythritol Quote Request',
    mailLines: {
      name: 'Name',
      company: 'Company',
      industry: 'Industry',
      grade: 'Grade required',
      volume: 'Monthly volume',
      contact: 'Contact (email/WeChat)',
      notes: 'Notes',
    },
  },

  tools: {
    label: '🔧 Calculators',
    lubricant: 'Lubricant Ester Yield',
    antioxidant: 'Antioxidant 1010 Batch',
    alkyd: 'Alkyd Resin Formula',
    all: 'All tools →',
  },

  calcIndex: {
    backToHome: '← Back to prices',
    freeBadge: 'Free Tools',
    title: 'Chemical Calculator Toolbox',
    subtitle: 'Professional calculators for the pentaerythritol value chain — prices auto-sync with current week market data',
    activeBadge: 'Live',
    useNow: 'Use now →',
    footerNote: '📌 All calculators are free, no registration required. Results automatically reference current week pentaerythritol market prices. For engineering reference only — actual production batches should be validated with raw material test reports.',
    footerLink: 'view current prices',
    footerOr: 'or contact us directly.',
    tools: {
      lubricant: {
        title: 'Lubricant Ester Yield Calculator',
        titleEn: 'POE Synthetic Lubricant',
        desc: 'Pentaerythritol + fatty acid esterification: compute tetraester yield, acid requirement, water removed, and PE feedstock cost. Supports C5/C8/C9/C10 and blended acids.',
        tags: ['Lubricants', 'POE', 'Tetraester', 'C8 C10'],
      },
      antioxidant: {
        title: 'Antioxidant 1010 Batch Calculator',
        titleEn: 'Irganox 1010 Synthesis',
        desc: 'Back-calculate PE and MDHP intermediate inputs from target Antioxidant 1010 output, with methanol byproduct valuation and PE feedstock cost (Irganox 1010 process).',
        tags: ['Antioxidant', 'Irganox 1010', 'MDHP', 'Polymer stabilizer'],
      },
      alkyd: {
        title: 'Alkyd Resin Design Tool',
        titleEn: 'Coating Formulation',
        desc: 'Enter target oil length and batch size — automatically calculates PE/glycerol, phthalic anhydride, and vegetable oil quantities, with composition breakdown and estimated acid value.',
        tags: ['Alkyd resin', 'Coatings', 'Oil length', 'Phthalic anhydride'],
      },
      ifr: {
        title: 'IFR Coating Ratio Calculator',
        titleEn: 'Intumescent Fire Retardant System',
        desc: 'Enter fire resistance rating and substrate type to get recommended APP:PER:MEL "three-in-one" ratios, procurement quantities for ammonium polyphosphate and melamine, and estimated coating yield.',
        tags: ['Fire retardant coating', 'IFR', 'APP', 'Melamine', 'Carbon source'],
      },
    },
  },

  calc: {
    inputs: 'Inputs',
    results: 'Results',
    reset: 'Reset',
    priceRefLink: 'View latest prices →',
    backToCalc: '← Back to calculators',
  },

  footer: {
    brand: 'PentaPrice · Pentaerythritol Market Prices',
    tagline: 'Professional Chemical Price Intelligence',
    inquiries: 'Inquiries & partnerships',
    refOnly: 'For reference only.',
    updated: 'Updated weekly',
  },

  nav: {
    backToQuotes: '← Back to price dashboard',
  },

  news: {
    readSource: '↗ Read source',
    noSourceLink: '· no source link',
  },

  meta: {
    title: 'PentaPrice · Pentaerythritol Price Tracker',
    description:
      'Weekly pentaerythritol price tracker: mono & di-PE, China EXW + global FOB/CIF. ' +
      'Updated every week with the latest market data.',
    calcTitle: 'Chemical Calculator Toolbox | PentaPrice',
    calcDesc: 'Free online calculators for the pentaerythritol value chain: lubricant ester yield, antioxidant 1010 batch, alkyd resin formulation.',
  },
}

export default en
