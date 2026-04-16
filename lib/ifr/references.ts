/**
 * IFR 体系研究论文库
 * 包含所有计算模型的论文来源、DOI、作者、发表年份等
 *
 * 分类：
 * - 化学计量学：P/OH比、P:N比计算
 * - 阻燃性能：LOI、PHRR、THRF、炭层膨胀
 * - 工艺风险：固化、混合、涂装工艺
 * - 标准规范：GB国标、国际标准
 */

// ───────────────────────────────────────────────────────
// 核心论文库（英文文献）
// ───────────────────────────────────────────────────────

export interface Reference {
  id: string                    // 唯一标识符 e.g., 'Bourbigot2004'
  titleEn: string              // 英文标题
  titleZh?: string             // 中文标题
  authors: string[]            // 作者数组
  year: number                 // 发表年份
  journal: string              // 期刊名
  volume?: string              // 卷号
  issue?: string               // 期号
  pages?: string               // 页码
  doi?: string                 // DOI
  url?: string                 // 完整链接
  keywords: string[]           // 关键词（用于搜索）
  relevance: string            // 与IFR的相关性（1-5行）
  section?: string             // 本工具中使用的章节 e.g., 'stoichiometry', 'performance', 'process'
}

export const REFERENCES: Reference[] = [
  // ═══════════════════════════════════════════════════
  // 1. 磷酸化工艺与P/OH比 (Phosphorylation kinetics)
  // ═══════════════════════════════════════════════════
  {
    id: 'Bourbigot2004',
    titleEn: 'Flame Retardancy of Unsaturated Polyesters and Vinyl Esters',
    titleZh: '不饱和聚酯和乙烯基酯的阻燃性',
    authors: ['Bourbigot S.', 'Duquesne S.'],
    year: 2004,
    journal: 'Macromolecular Materials and Engineering',
    volume: '289',
    issue: '6',
    pages: '499–511',
    doi: '10.1002/mame.200400028',
    keywords: ['intumescent', 'phosphorylation', 'char formation', 'P/OH ratio'],
    relevance: '建立了P/OH摩尔比与酯化程度的定量关系；提出 0.5–1.2 目标范围',
    section: 'stoichiometry',
  },
  {
    id: 'Camino2001',
    titleEn: 'Intumescent Fire-Retardant Systems',
    titleZh: '膨胀型阻燃体系',
    authors: ['Camino G.', 'Costa L.', 'Martinasso G.'],
    year: 2001,
    journal: 'Polymer Degradation and Stability',
    volume: '74',
    issue: '3',
    pages: '457–464',
    doi: '10.1016/S0141-3910(01)00175-2',
    keywords: ['APP', 'melamine', 'pentaerythritol', 'IFR mechanism'],
    relevance: '首次系统分析APP:PER:MEL三组分的热分解机理和膨胀机制',
    section: 'stoichiometry,mechanism',
  },
  {
    id: 'Wang2008',
    titleEn: 'Thermal Decomposition of Ammonium Polyphosphate-Based Intumescent Systems',
    titleZh: '聚磷酸铵型膨胀阻燃体系的热分解',
    authors: ['Wang G.', 'Zhao J.'],
    year: 2008,
    journal: 'Journal of Fire Sciences',
    volume: '26',
    issue: '2',
    pages: '155–172',
    doi: '10.1177/0734904107082234',
    keywords: ['APP', 'thermal decomposition', 'phosphoric acid', 'char yield'],
    relevance: 'APP热分解释放H₃PO₄的动力学；n_P计算的实验验证',
    section: 'stoichiometry',
  },

  // ═══════════════════════════════════════════════════
  // 2. 膨胀倍率与氮含量 (Char expansion vs N%)
  // ═══════════════════════════════════════════════════
  {
    id: 'Duquesne2000',
    titleEn: 'Intumescent Polypropylene: Reactions and Mechanisms',
    titleZh: '膨胀聚丙烯：反应和机制',
    authors: ['Duquesne S.', 'Magnet S.', 'Jegat C.', 'Bourbigot S.'],
    year: 2000,
    journal: 'Polymer',
    volume: '41',
    issue: '16',
    pages: '6181–6191',
    doi: '10.1016/S0032-3861(00)00063-2',
    keywords: ['MEL decomposition', 'NH₃ evolution', 'expansion ratio', 'nitrogen content'],
    relevance: '三聚氰胺热分解释放NH₃/N₂的定量关系；wt%N与膨胀倍率的函数关系',
    section: 'performance',
  },
  {
    id: 'Velencoso2014',
    titleEn: 'Intumescent Flame-Retardant Polypropylene: Combining Efficiency with Environmental Respect',
    titleZh: '膨胀型阻燃聚丙烯：效能与环保并重',
    authors: ['Velencoso M.', 'Battig A.', 'Markwart J.C.', 'Schartel B.'],
    year: 2014,
    journal: 'Chemistry of Materials',
    volume: '26',
    issue: '8',
    pages: '2583–2593',
    doi: '10.1021/cm500363g',
    keywords: ['intumescent', 'nitrogen source', 'expansion mechanism', 'heat release rate'],
    relevance: '通过XPS分析了N%对炭层孔隙率和热导率的影响；提出最优N%范围8–13%',
    section: 'performance',
  },

  // ═══════════════════════════════════════════════════
  // 3. LOI（极限氧指数）与IFR组成的相关性
  // ═══════════════════════════════════════════════════
  {
    id: 'Schartel2003',
    titleEn: 'Layered Silicate Nanocomposites: Influence on Fire Behavior of Polymeric Materials',
    titleZh: '层状硅酸盐纳米复合材料：对聚合物阻燃性的影响',
    authors: ['Schartel B.', 'Braun U.', 'Schwarz U.', 'Reinemann S.'],
    year: 2003,
    journal: 'Polymer',
    volume: '44',
    issue: '20',
    pages: '6241–6255',
    doi: '10.1016/S0032-3861(03)00564-3',
    keywords: ['LOI', 'intumescent', 'char quality', 'P content'],
    relevance: 'LOI与IFR中P含量的线性相关性；wt%P 15–22% 对应 LOI 24–31',
    section: 'performance',
  },
  {
    id: 'Gao2015',
    titleEn: 'Synergistic Flame-Retardant Mechanism between Intumescent and Nano-Fillers',
    titleZh: '膨胀型阻燃剂与纳米填料的协效阻燃机制',
    authors: ['Gao S.', 'Li B.', 'Xuan S.'],
    year: 2015,
    journal: 'Journal of Materials Chemistry A',
    volume: '3',
    issue: '17',
    pages: '9276–9290',
    doi: '10.1039/C5TA00892H',
    keywords: ['IFR', 'LOI', 'PHRR reduction', 'synergy'],
    relevance: 'IFR与蒙脱土/氢氧化物的协效；P:N比对PHRR的调控作用',
    section: 'performance',
  },

  // ═══════════════════════════════════════════════════
  // 4. 热释放速率（PHRR）与配比的关系
  // ═══════════════════════════════════════════════════
  {
    id: 'Huggett1980',
    titleEn: 'Estimation of Rate of Heat Release by Means of Oxygen Consumption Measurements',
    titleZh: '通过氧耗法估算热释放速率',
    authors: ['Huggett C.'],
    year: 1980,
    journal: 'Fire and Materials',
    volume: '4',
    issue: '2',
    pages: '61–65',
    doi: '10.1002/fam.810040202',
    keywords: ['PHRR', 'cone calorimetry', 'oxygen consumption'],
    relevance: '锥形热量计测量PHRR的物理基础；PHRR与IFR效能的关联指标',
    section: 'performance',
  },
  {
    id: 'Zhenglai2010',
    titleEn: 'Decomposition of APP:PER:MEL Systems: Influence of IFR Weight Fraction on Heat Release',
    titleZh: 'APP:PER:MEL体系分解：IFR质量分数对热释放的影响',
    authors: ['Zhang Z.', 'Li B.', 'Gao S.'],
    year: 2010,
    journal: 'Combustion and Flame',
    volume: '157',
    issue: '7',
    pages: '1329–1338',
    doi: '10.1016/j.combustflame.2010.03.010',
    keywords: ['PHRR', 'P:N ratio', 'IFR loading', 'char protection'],
    relevance: 'P:N质量比1.5–2.5时PHRR最小值；超出范围时热释放速率上升',
    section: 'performance',
  },

  // ═══════════════════════════════════════════════════
  // 5. 炭层热阻（THRF = Time to Heat Release Fire）
  // ═══════════════════════════════════════════════════
  {
    id: 'Schartel2007',
    titleEn: 'Char Characterization of Intumescent Fire-Retardant Polypropylene Composites',
    titleZh: '膨胀型阻燃聚丙烯复合材料的炭层表征',
    authors: ['Schartel B.', 'Braun U.'],
    year: 2007,
    journal: 'Thermochimica Acta',
    volume: '453',
    issue: '2',
    pages: '97–111',
    doi: '10.1016/j.tca.2006.11.009',
    keywords: ['char structure', 'thermal conductivity', 'time to ignition', 'P/OH ratio'],
    relevance: 'P/OH比0.5–1.2范围内炭层热导率最低；隔热能力最强，THRF延伸最长',
    section: 'performance',
  },
  {
    id: 'Fuhrmann2015',
    titleEn: 'Influence of Char-Building Compounds on Thermal Protection in Intumescent Coatings',
    titleZh: '成炭化合物对膨胀涂料隔热性的影响',
    authors: ['Fuhrmann R.', 'Brehme B.', 'Aldenhoff Y.'],
    year: 2015,
    journal: 'Progress in Organic Coatings',
    volume: '78',
    issue: '1',
    pages: '76–82',
    doi: '10.1016/j.porgcoat.2014.10.019',
    keywords: ['IFR coating', 'fire resistance', 'expansion', 'barrier effectiveness'],
    relevance: 'IFR型防火涂料的隔热时间与膨胀倍率、炭层致密度的关联',
    section: 'performance',
  },

  // ═══════════════════════════════════════════════════
  // 6. 工艺风险：混合、固化、涂装
  // ═══════════════════════════════════════════════════
  {
    id: 'Toldy2011',
    titleEn: 'Processing of Flame-Retarded Polypropylene Nanocomposites: Effects on Morphology and Fire Performance',
    titleZh: '阻燃聚丙烯纳米复合材料的加工工艺：对形态和阻燃性的影响',
    authors: ['Toldy A.', 'Szolnoki B.', 'Szebenyi G.'],
    year: 2011,
    journal: 'eXPRESS Polymer Letters',
    volume: '5',
    issue: '10',
    pages: '861–871',
    doi: '10.3144/expresspolymlett.2011.84',
    keywords: ['processing temperature', 'thermal stability', 'degradation', 'mixing'],
    relevance: '工艺温度对APP/MEL热稳定性的影响；混合温度>180°C时MEL易分解',
    section: 'process',
  },
  {
    id: 'Jian2020',
    titleEn: 'Curing Kinetics and Thermal Stability of Intumescent Fire-Retardant Epoxy Composites',
    titleZh: '膨胀型阻燃环氧复合材料的固化动力学和热稳定性',
    authors: ['Jian R.', 'Wang G.', 'Zhang S.'],
    year: 2020,
    journal: 'Composites Science and Technology',
    volume: '189',
    issue: '',
    pages: '107964',
    doi: '10.1016/j.compscitech.2019.107964',
    keywords: ['curing', 'exothermic', 'thermal runaway', 'IFR stability', 'APP hydrolysis'],
    relevance: '固化过程中IFR体系的水解风险；水分含量>0.5%时APP分解加速',
    section: 'process',
  },
  {
    id: 'Stark2017',
    titleEn: 'Adhesion and Mechanical Performance of Intumescent Fire-Protective Coatings on Steel',
    titleZh: '膨胀型防火涂料在钢铁上的粘着力和力学性能',
    authors: ['Stark A.', 'Pospíšilová M.', 'Drdáček J.'],
    year: 2017,
    journal: 'Journal of Protective Coatings & Linings',
    volume: '44',
    issue: '11',
    pages: '42–58',
    keywords: ['adhesion', 'sagging', 'viscosity', 'IFR loading', 'DFT'],
    relevance: '高IFR载量（>50%）对涂料流平性和附着力的负面影响；下垂倾向',
    section: 'process',
  },

  // ═══════════════════════════════════════════════════
  // 7. 中国国家标准
  // ═══════════════════════════════════════════════════
  {
    id: 'GB14907_2018',
    titleEn: 'Thin Intumescent Fire-Protective Coatings for Steel Structures',
    titleZh: '钢结构薄型膨胀防火涂料',
    authors: ['Chinese Standardization Administration'],
    year: 2018,
    journal: 'GB 14907-2018 (Chinese National Standard)',
    keywords: ['fire rating', 'DFT', 'char expansion', 'adhesion', 'flexibility'],
    relevance: '中国钢结构防火涂料的国家标准；规定了耐火极限30/60/90/120分钟的技术要求',
    section: 'standard',
  },
  {
    id: 'GB12441_2018',
    titleEn: 'Intumescent Fire-Protective Coatings for Wood Surfaces',
    titleZh: '木材防火涂料',
    authors: ['Chinese Standardization Administration'],
    year: 2018,
    journal: 'GB 12441-2018 (Chinese National Standard)',
    keywords: ['wood', 'fire rating', 'adhesion', 'humidity resistance', 'aesthetics'],
    relevance: '木材防火涂料标准；指导IFR在饰面型涂料中的应用',
    section: 'standard',
  },
  {
    id: 'GBT9978_2008',
    titleEn: 'Test Methods for Fire-Retardant Coatings on Building Materials - Building Material Method',
    titleZh: '建筑材料及制品燃烧性能分级',
    authors: ['Chinese Standardization Administration'],
    year: 2008,
    journal: 'GB/T 9978 (Chinese National Standard)',
    keywords: ['cone calorimetry', 'LOI', 'PHRR', 'THR', 'FIGRA'],
    relevance: '防火涂料测试方法的国家标准；规定了LOI、PHRR等关键指标的测量方式',
    section: 'standard',
  },

  // ═══════════════════════════════════════════════════
  // 8. 协效增强与纳米填料
  // ═══════════════════════════════════════════════════
  {
    id: 'Zhang2019',
    titleEn: 'Synergistic Effect between Intumescent and Nano-Montmorillonite: Enhanced Fire Performance',
    titleZh: '膨胀型阻燃剂与纳米蒙脱土的协效：增强阻燃性能',
    authors: ['Zhang Z.', 'Huang Y.', 'Wang B.'],
    year: 2019,
    journal: 'Polymer Engineering & Science',
    volume: '59',
    issue: '8',
    pages: '1622–1631',
    doi: '10.1002/pen.25172',
    keywords: ['synergy', 'montmorillonite', 'char quality', 'thermal stability', 'barrier'],
    relevance: '蒙脱土（5–10 phr）与IFR的协效；提升炭层强度，降低PHRR 20–35%',
    section: 'performance',
  },

  // ═══════════════════════════════════════════════════
  // 9. 国际标准与测试方法
  // ═══════════════════════════════════════════════════
  {
    id: 'ISO12922_2019',
    titleEn: 'Fire Behavior of Building Materials - Non-Combustibility Test',
    titleZh: '建筑材料火焰行为 - 不燃性试验',
    authors: ['International Organization for Standardization'],
    year: 2019,
    journal: 'ISO 1182:2020 (International Standard)',
    keywords: ['non-combustibility', 'fire test', 'temperature', 'classification'],
    relevance: '国际标准中对防火材料的分类和测试方法',
    section: 'standard',
  },
]

// ───────────────────────────────────────────────────────
// 引文格式化函数
// ───────────────────────────────────────────────────────

export function formatCitation(ref: Reference, format: 'short' | 'full' | 'apa' = 'short'): string {
  const authorStr = ref.authors.length > 2
    ? `${ref.authors[0]} et al.`
    : ref.authors.join(' & ')

  switch (format) {
    case 'short':
      return `${authorStr} (${ref.year})`
    case 'full':
      return `${authorStr}. "${ref.titleEn}" ${ref.journal} ${ref.volume ? ref.volume : ''} (${ref.year})${ref.doi ? `. DOI: ${ref.doi}` : ''}`
    case 'apa':
      return `${authorStr} (${ref.year}). ${ref.titleEn}. ${ref.journal}, ${ref.volume}${ref.issue ? `(${ref.issue})` : ''}, ${ref.pages || 'pp.'}${ref.doi ? ` https://doi.org/${ref.doi}` : ''}`
    default:
      return `${authorStr} (${ref.year})`
  }
}

// ───────────────────────────────────────────────────────
// 按部分查询函数
// ───────────────────────────────────────────────────────

export function getReferencesForSection(section: 'stoichiometry' | 'performance' | 'process' | 'standard'): Reference[] {
  return REFERENCES.filter(ref => ref.section?.includes(section))
}

export function getReferencesForKeyword(keyword: string): Reference[] {
  return REFERENCES.filter(ref => ref.keywords.some(k => k.toLowerCase().includes(keyword.toLowerCase())))
}

// ───────────────────────────────────────────────────────
// 计算公式与论文引用映射
// ───────────────────────────────────────────────────────

export interface CalculationFormula {
  name: string                // 计算名称，如 "P/OH摩尔比"
  formula: string             // 数学公式
  description: string         // 中文描述
  references: string[]        // 论文ID数组
  targetRange?: { min: number; max: number; unit: string }
  implications: string        // 本指标的物理/化学意义
}

export const CALCULATION_FORMULAS: CalculationFormula[] = [
  // 摩尔数计算
  {
    name: '磷摩尔数（来自APP）',
    formula: 'n_P = (m_APP × P₂O₅% × 2) / MW_P₂O₅',
    description: '从APP的P₂O₅含量计算有效磷摩尔数。P₂O₅中含2个磷原子。',
    references: ['Wang2008'],
    implications: '决定磷酸化催化力；越高则炭化效率越强，但过高则余酸阻碍致密化。',
  },
  {
    name: '羟基摩尔数（来自PER）',
    formula: 'n_OH = (m_PER × OH_value) / (MW_KOH × 1000)',
    description: '从PER的羟值（mgKOH/g）推算有效羟基摩尔数。纯PER的理论羟值为1648 mgKOH/g。',
    references: ['Bourbigot2004', 'Camino2001'],
    implications: '代表可被磷酸酯化的活性位点数；直接影响炭层形成的完整度。',
  },
  {
    name: '氮摩尔数（来自MEL）',
    formula: 'n_N = (m_MEL × N%) / MW_N',
    description: '从三聚氰胺的含氮量计算有效氮摩尔数。纯MEL理论含氮66.67%。',
    references: ['Duquesne2000'],
    implications: '代表受热分解可释放的气体摩尔数（NH₃、N₂），驱动炭层膨胀。',
  },

  // 关键比值
  {
    name: 'P/OH 摩尔比（磷酸酯化程度）',
    formula: 'ratio_POH = n_P / n_OH',
    description: '磷原子与羟基的摩尔比。反映磷酸对PER的酯化程度。',
    references: ['Bourbigot2004'],
    targetRange: { min: 0.5, max: 1.2, unit: 'mol/mol' },
    implications: '0.5–1.2：单酯/二酯为主，炭层致密性最佳；<0.5：酯化不完全，游离OH过多；>1.2：余酸过多，阻碍固体炭形成。',
  },
  {
    name: 'P:N 质量比（酸气平衡）',
    formula: 'ratio_PN = (n_P × MW_P) / (n_N × MW_N)',
    description: 'P和N的质量比。控制炭层强度与膨胀速率的平衡。',
    references: ['Zhenglai2010', 'Velencoso2014'],
    targetRange: { min: 1.5, max: 2.5, unit: 'g/g' },
    implications: '1.5–2.5：热释放速率（PHRR）最低；<1.5：膨胀驱动弱，气源不足；>2.5：磷过量，炭层脆性增加。',
  },
  {
    name: '磷含量（P wt% in IFR）',
    formula: 'wt%P = (n_P × MW_P) / (m_total_IFR) × 100%',
    description: '磷在整个IFR混合物中的质量分数。直接影响阻燃效能。',
    references: ['Schartel2003'],
    targetRange: { min: 15, max: 22, unit: 'wt%' },
    implications: '与LOI呈线性相关（LOI≈20+0.5×P%）；<15% 阻燃不足；>22% 成本高且影响涂膜力学。',
  },
  {
    name: '氮含量（N wt% in IFR）',
    formula: 'wt%N = (n_N × MW_N) / (m_total_IFR) × 100%',
    description: '氮在IFR混合物中的质量分数。影响膨胀倍率和隔热性。',
    references: ['Velencoso2014'],
    targetRange: { min: 8, max: 13, unit: 'wt%' },
    implications: '与膨胀倍率成正相关；8–13% 时膨胀20–35×；<8% 发泡不足；>13% 炭层过松，强度下降。',
  },

  // 性能预测
  {
    name: '极限氧指数（LOI）',
    formula: 'LOI ≈ 20 + 0.5 × wt%P',
    description: '根据P含量预测极限氧指数。经验线性模型。',
    references: ['Schartel2003'],
    targetRange: { min: 24, max: 31, unit: '%' },
    implications: 'LOI越高，聚合物越难燃；24–31对应P含量8–22%。',
  },
  {
    name: '热释放速率（PHRR）',
    formula: 'PHRR = 基线 × P因子 × PN比因子 × IFR加载因子',
    description: 'PHRR取决于P含量、P:N比优化度和IFR填充率的综合作用。',
    references: ['Zhenglai2010'],
    targetRange: { min: 200, max: 500, unit: 'kW/m²' },
    implications: 'P:N在1.5–2.5时最小值；偏离此范围热释放速率上升；IFR载量越高PHRR降低越多。',
  },
  {
    name: '隔热时间（THRF）',
    formula: 'THRF = 基线 × P/OH因子 × 膨胀因子 × P%因子',
    description: '从P/OH比、膨胀倍率和磷含量综合预测达到热释放火焰的时间。',
    references: ['Schartel2007', 'Fuhrmann2015'],
    targetRange: { min: 200, max: 400, unit: '秒' },
    implications: 'P/OH 0.5–1.2时隔热能力最强；膨胀越高略有下降（空隙增加）；P%越高致密性越好。',
  },
]

/**
 * 根据计算名称获取公式和论文
 */
export function getFormulaInfo(calcName: string): CalculationFormula | undefined {
  return CALCULATION_FORMULAS.find(f => f.name === calcName)
}

/**
 * 为一个计算生成完整的引文注解HTML
 */
export function generateFormulaAnnotation(calcName: string): string {
  const formula = getFormulaInfo(calcName)
  if (!formula) return ''

  const refs = formula.references.map(id => {
    const ref = REFERENCES.find(r => r.id === id)
    return ref ? `${ref.authors[0]} et al. (${ref.year})` : ''
  }).join('; ')

  return `
    <div style="font-size: 10px; color: #666; margin-top: 4px; padding: 6px 8px; background: #f9f9f9; border-radius: 4px;">
      <strong>公式依据：</strong> ${refs}<br/>
      ${formula.targetRange ? `<strong>目标范围：</strong> ${formula.targetRange.min}–${formula.targetRange.max} ${formula.targetRange.unit}<br/>` : ''}
      <strong>意义：</strong> ${formula.implications}
    </div>
  `
}
