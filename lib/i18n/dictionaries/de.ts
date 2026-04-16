import type { Dictionary } from './zh'

const de: Dictionary = {
  hero: {
    title: 'PentaPrice · Pentaerythritol Marktpreise',
    subtitle: 'Mono- & Di-PE · China Ab-Werk + Weltmarkt FOB / CIF · Wöchentlich aktualisiert',
    thisWeek: 'Diese Woche',
    updated: 'Aktualisiert',
  },

  tabs: {
    mono: 'Mono-PE',
    di: 'Di-PE',
    intl: 'Weltmarkt',
  },

  change: {
    wow: 'WoW',
    mom: 'MoM',
    flat: 'unverändert WoW',
    flatLabel: '— unverändert WoW',
    pcbDriven: '▲ PCB-getrieben',
    tightSupply: '— knappes Angebot',
  },

  mono: {
    domesticAvg: 'Inlandsdurchschnitt',
    domesticAvgSub: 'China Ab-Werk Durchschnitt (¥/t)',
    grade95: '95 % Qualität Ab-Werk',
    grade95Sub: 'Ab Werk inkl. MwSt. (¥/t)',
    grade98: '98 % Qualität Ab-Werk',
    grade98Sub: 'Ab Werk inkl. MwSt. (¥/t)',
    fobQingdao: 'FOB Qingdao',
    fobQingdaoSub: 'USD/t',
    chartTitle: 'Mono-PE Preisentwicklung – 12 Wochen',
    legendDomestic: 'China Inlandsdurchschnitt (¥/t)',
    legendFob: 'FOB Qingdao ×10 (USD/t, Ref.)',
    regionalTitle: 'Regionale Preisübersicht',
    newsTitle: 'Marktkommentar',
    regionHeader: 'Region / Qualität',
    priceHeader: 'Preis',
    vatNote: 'Inlandspreise inkl. 13 % MwSt.',
  },

  di: {
    marketAvg: 'Marktdurchschnitt',
    marketAvgSub: '¥/t',
    highEnd: 'Hochpreissegment',
    highEndSub: '¥/t',
    vsOct: 'ggü. Okt. 2024',
    vsOctSub: 'Jahresvergleich',
    fobExport: 'FOB Export',
    fobExportSub: 'USD/t',
    trendTitle: 'Di-PE Preisentwicklung – 18 Monate',
    legendAvg: 'Durchschnitt',
    legendHighEnd: 'Hochpreissegment',
    supplyTitle: 'Angebot-Nachfrage-Lücke (kt)',
    supplyLabel: 'Effektives Angebot',
    demandLabel: 'Marktnachfrage',
    gapPrefix: 'Lücke ≈',
    chartNote: '1 万吨 = 10 kt = 10.000 t · Zeitraum ausstehend',
    newsTitle: 'Marktentwicklung',
    momLabel: 'MoM',
  },

  intl: {
    usCif: 'USA CIF',
    usCifSub: 'USD/t',
    euCif: 'Europa (DE)',
    euCifSub: 'USD/t',
    chinaFob: 'China FOB',
    chinaFobSub: 'USD/t',
    seaCif: 'Südostasien CIF',
    seaCifSub: 'USD/t',
    chartTitle: 'Globaler Marktpreisvergleich (USD/t)',
    legendUS: 'USA',
    legendEU: 'Europa',
    legendCN: 'China FOB',
    legendSEA: 'Südostasien',
    newsTitle: 'Weltmarkt-Kommentar',
  },

  glossary: {
    yPerT: 'Yuan (RMB) pro Tonne',
    usdPerT: 'US-Dollar pro Tonne',
    kt: '1.000 Tonnen',
    wow: 'Wochenvergleich',
    mom: 'Monatsvergleich',
    exw: 'Ab Werk (Fabrikabgabepreis)',
    fob: 'Frei an Bord',
    cif: 'Kosten, Versicherung & Fracht',
  },

  cta: {
    heading: 'Zuverlässige Versorgung mit hochreinem Pentaerythritol?',
    headingEn: '',
    body: '98 % / 95 % Qualität · Großmengen auf Lager · Vollständige Exportdokumentation · Technischer Support',
    bodyEn: '',
    btn: 'Angebot anfordern →',
  },

  inquiry: {
    modalTitle: 'Angebot anfordern',
    modalSub: 'Ihr E-Mail-Programm öffnet sich nach dem Absenden',
    close: 'Schließen',
    nameLbl: 'Name',
    companyLbl: 'Unternehmen',
    industryLbl: 'Branche',
    gradeLbl: 'Gewünschte Qualität',
    volumeLbl: 'Geschätzter Monatsbedarf (t)',
    contactLbl: 'Kontakt (E-Mail / WeChat)',
    notesLbl: 'Anmerkungen',
    namePlaceholder: 'Ihr Name',
    companyPlaceholder: 'Firmenname',
    select: 'Bitte wählen',
    industries: [
      { value: 'Coatings', label: 'Lacke & Beschichtungen' },
      { value: 'Lubricants', label: 'Schmierstoffe / POE' },
      { value: 'Antioxidants', label: 'Antioxidationsmittel' },
      { value: 'Other', label: 'Sonstiges' },
    ],
    grades: [
      { value: 'Mono-PE 95%', label: 'Mono-PE 95 %' },
      { value: 'Mono-PE 98%', label: 'Mono-PE 98 %' },
      { value: 'Di-PE', label: 'Di-PE (Dipentaerythritol)' },
    ],
    volumePlaceholder: 'z. B. 50',
    contactPlaceholder: 'E-Mail oder WeChat-ID',
    notesPh: 'Lieferort, Verpackungsanforderungen, sonstige Hinweise…',
    disclaimer: 'Beim Absenden öffnet sich Ihr Standard-E-Mail-Programm, vorausgefüllt an',
    cancelBtn: 'Abbrechen',
    submitBtn: 'Anfrage senden →',
    thanksTitle: 'E-Mail-Programm geöffnet',
    thanksBody: 'Bitte senden Sie die E-Mail in Ihrem E-Mail-Programm ab. Wir antworten innerhalb von 1 Werktag.',
    closeBtn: 'Schließen',
    emailSubject: 'Pentaerythritol Angebotsanfrage',
    mailLines: {
      name: 'Name',
      company: 'Unternehmen',
      industry: 'Branche',
      grade: 'Gewünschte Qualität',
      volume: 'Monatsbedarf',
      contact: 'Kontakt (E-Mail/WeChat)',
      notes: 'Anmerkungen',
    },
  },

  tools: {
    label: '🔧 Berechnungstools',
    lubricant: 'Schmierstoff-Esterausbeute',
    antioxidant: 'Antioxidans 1010 Batch',
    alkyd: 'Alkydharz-Formulierung',
    all: 'Alle Tools →',
  },

  calcIndex: {
    backToHome: '← Zurück zu Preisen',
    freeBadge: 'Kostenlose Tools',
    title: 'Chemische Berechnungstools',
    subtitle: 'Professionelle Rechner für die Pentaerythritol-Wertschöpfungskette — Preise synchronisieren sich automatisch mit dem aktuellen Wochenmarkt',
    activeBadge: 'Verfügbar',
    useNow: 'Jetzt verwenden →',
    footerNote: '📌 Alle Rechner sind kostenlos und erfordern keine Registrierung. Ergebnisse referenzieren automatisch die aktuellen Wochenmarktpreise für Pentaerythritol. Nur für technische Referenzzwecke — tatsächliche Produktionschargen sollten mit Rohstoffprüfberichten validiert werden.',
    footerLink: 'aktuelle Preise anzeigen',
    footerOr: 'oder kontaktieren Sie uns direkt.',
    tools: {
      lubricant: {
        title: 'Schmierstoff-Ester-Ausbeute-Rechner',
        titleEn: 'POE Synthetikschmierstoff',
        desc: 'Pentaerythritol + Fettsäure-Veresterung: Berechnung der Tetraester-Ausbeute, Fettsäurebedarf, Kondensationswasser und PE-Rohstoffkosten. Unterstützt C5/C8/C9/C10 und Mischsäuren.',
        tags: ['Schmierstoffe', 'POE', 'Tetraester', 'C8 C10'],
      },
      antioxidant: {
        title: 'Antioxidans 1010 Batch-Rechner',
        titleEn: 'Irganox 1010 Synthese',
        desc: 'Rückberechnung von PE- und MDHP-Einsatzmengen aus der Zielmenge Antioxidans 1010, mit Methanol-Nebenproduktbewertung und PE-Rohstoffkosten (Irganox 1010-Verfahren).',
        tags: ['Antioxidationsmittel', 'Irganox 1010', 'MDHP', 'Polymerstabilisator'],
      },
      alkyd: {
        title: 'Alkydharz-Formulierungstool',
        titleEn: 'Lackformulierung',
        desc: 'Zielölgehalt und Chargengröße eingeben — automatische Berechnung von PE/Glycerin, Phthalsäureanhydrid und Pflanzenöl, mit Formulierungsübersicht und geschätzter Säurezahl.',
        tags: ['Alkydharz', 'Lackierung', 'Ölgehalt', 'Phthalsäureanhydrid'],
      },
      ifr: {
        title: 'IFR-Beschichtungs-Verhältnisrechner',
        titleEn: 'Intumeszierendes Brandschutzsystem',
        desc: 'Feuerwiderstandsklasse und Substrat eingeben — empfohlene APP:PER:MEL-Verhältnisse und Beschaffungsmengen für Ammoniumpolyphosphat und Melamin, mit geschätzter Beschichtungsausbeute.',
        tags: ['Brandschutzbeschichtung', 'IFR', 'APP', 'Melamin', 'Kohlenstoffquelle'],
      },
      ifrPro: {
        title: 'IFR Pro Erweiterte Optimierung',
        titleEn: 'IFR Leistungsvorhersage-Engine',
        desc: 'Professionelle Formulierungsoptimierung: Stöchiometrische Analyse von Zertifikatsdaten, LOI/PHRR/THRF-Leistungsprognose, Prozessrisikobewertung über 5 Module, 16+ akademische Papierverweis. Ideal für Ingenieur-Dokumentation, Patentanwendungen und Chargen-Benchmarking.',
        tags: ['Brandschutz Pro', 'Leistungsvorhersage', 'Akademische Unterstützung', 'LOI PHRR THRF', 'Risikobewertung'],
      },
    },
  },

  calc: {
    inputs: 'Eingabeparameter',
    results: 'Berechnungsergebnisse',
    reset: 'Zurücksetzen',
    priceRefLink: 'Aktuelle Preise anzeigen →',
    backToCalc: '← Zurück zu Berechnungstools',
  },

  footer: {
    brand: 'PentaPrice · Pentaerythritol Marktpreise',
    tagline: 'Professionelle Chemikalienpreis-Intelligence',
    inquiries: 'Anfragen & Partnerschaften',
    refOnly: 'Nur zur Referenz.',
    updated: 'Wöchentlich aktualisiert',
  },

  nav: {
    backToQuotes: '← Zurück zum Preis-Dashboard',
  },

  news: {
    readSource: '↗ Quelle lesen',
    noSourceLink: '· kein Quelllink',
  },

  meta: {
    title: 'PentaPrice · Pentaerythritol Marktpreise',
    description:
      'Wöchentlicher Pentaerythritol-Preisüberblick: Mono- & Di-PE, China Ab-Werk + globale FOB/CIF-Preise. ' +
      'Jede Woche mit den neuesten Marktdaten aktualisiert.',
    calcTitle: 'Chemische Berechnungstools | PentaPrice',
    calcDesc: 'Kostenlose Online-Rechner für die Pentaerythritol-Wertschöpfungskette: Schmierstoff-Esterausbeute, Antioxidans 1010 Batch, Alkydharz-Formulierung.',
  },
}

export default de
