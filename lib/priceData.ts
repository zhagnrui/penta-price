export type SeasonType = "single" | "double" | "international";

export interface PriceItem {
  id: string;
  model: string;
  spec: string;
  capacity: string;
  weight: string;
  material: string;
  moq: number;
  priceRanges: {
    qty: string;
    price: number;
    currency: string;
  }[];
  features: string[];
  inStock: boolean;
}

export interface SeasonCategory {
  key: SeasonType;
  label: string;
  description: string;
  items: PriceItem[];
}

export const priceData: SeasonCategory[] = [
  {
    key: "single",
    label: "单季帐篷",
    description: "适用于春夏季节，轻量透气，适合徒步露营",
    items: [
      {
        id: "s-001",
        model: "PentaTrek 1P",
        spec: "210×90×110 cm",
        capacity: "1人",
        weight: "1.2 kg",
        material: "20D 尼龙 + 铝合金帐杆",
        moq: 50,
        priceRanges: [
          { qty: "50–99", price: 28, currency: "USD" },
          { qty: "100–299", price: 24, currency: "USD" },
          { qty: "300+", price: 20, currency: "USD" },
        ],
        features: ["防泼水 2000mm", "通风侧窗", "轻量脚垫", "收纳袋附带"],
        inStock: true,
      },
      {
        id: "s-002",
        model: "PentaTrek 2P",
        spec: "210×130×115 cm",
        capacity: "2人",
        weight: "1.8 kg",
        material: "20D 尼龙 + 铝合金帐杆",
        moq: 50,
        priceRanges: [
          { qty: "50–99", price: 38, currency: "USD" },
          { qty: "100–299", price: 32, currency: "USD" },
          { qty: "300+", price: 27, currency: "USD" },
        ],
        features: ["防泼水 2000mm", "双门双前庭", "快速搭建", "内置收纳袋"],
        inStock: true,
      },
      {
        id: "s-003",
        model: "PentaShade 3P",
        spec: "300×180×125 cm",
        capacity: "3人",
        weight: "2.6 kg",
        material: "30D 涤纶 + 玻纤帐杆",
        moq: 30,
        priceRanges: [
          { qty: "30–99", price: 45, currency: "USD" },
          { qty: "100–299", price: 38, currency: "USD" },
          { qty: "300+", price: 32, currency: "USD" },
        ],
        features: ["遮阳涂层", "超宽前庭", "地钉×12", "维修套件"],
        inStock: true,
      },
      {
        id: "s-004",
        model: "PentaUL Solo",
        spec: "200×80×95 cm",
        capacity: "1人",
        weight: "0.85 kg",
        material: "15D 硅尼龙 + 碳纤杆",
        moq: 100,
        priceRanges: [
          { qty: "100–199", price: 55, currency: "USD" },
          { qty: "200–499", price: 46, currency: "USD" },
          { qty: "500+", price: 39, currency: "USD" },
        ],
        features: ["超轻量级", "一体式单杆", "高强碳纤维", "压缩收纳"],
        inStock: false,
      },
    ],
  },
  {
    key: "double",
    label: "双季帐篷",
    description: "四季通用，加厚防风防雨，高海拔远征首选",
    items: [
      {
        id: "d-001",
        model: "PentaStorm 2P",
        spec: "215×135×120 cm",
        capacity: "2人",
        weight: "2.9 kg",
        material: "40D 尼龙 + 7001 铝合金杆",
        moq: 30,
        priceRanges: [
          { qty: "30–99", price: 72, currency: "USD" },
          { qty: "100–299", price: 60, currency: "USD" },
          { qty: "300+", price: 50, currency: "USD" },
        ],
        features: ["防水 3000mm", "双层结构", "抗风 60km/h", "雪裙设计"],
        inStock: true,
      },
      {
        id: "d-002",
        model: "PentaStorm 3P",
        spec: "310×190×130 cm",
        capacity: "3人",
        weight: "3.8 kg",
        material: "40D 尼龙 + 7001 铝合金杆",
        moq: 30,
        priceRanges: [
          { qty: "30–99", price: 95, currency: "USD" },
          { qty: "100–299", price: 80, currency: "USD" },
          { qty: "300+", price: 68, currency: "USD" },
        ],
        features: ["防水 3000mm", "独立前庭", "交叉帐杆加固", "内帐可拆"],
        inStock: true,
      },
      {
        id: "d-003",
        model: "PentaAlpine 2P",
        spec: "220×130×105 cm",
        capacity: "2人",
        weight: "2.4 kg",
        material: "30D 硅尼龙 + DAC 铝合金杆",
        moq: 50,
        priceRanges: [
          { qty: "50–99", price: 118, currency: "USD" },
          { qty: "100–299", price: 98, currency: "USD" },
          { qty: "300+", price: 82, currency: "USD" },
        ],
        features: ["DAC 弯杆系统", "抗风 80km/h", "防水 4000mm", "雪裙+冰锥"],
        inStock: true,
      },
      {
        id: "d-004",
        model: "PentaBase Camp 4P",
        spec: "380×230×175 cm",
        capacity: "4人",
        weight: "6.2 kg",
        material: "50D 涤纶 + 7001 铝合金杆",
        moq: 20,
        priceRanges: [
          { qty: "20–49", price: 155, currency: "USD" },
          { qty: "50–149", price: 130, currency: "USD" },
          { qty: "150+", price: 110, currency: "USD" },
        ],
        features: ["大型前庭", "360° 通风", "抗压加固顶部", "营地级稳固性"],
        inStock: true,
      },
    ],
  },
  {
    key: "international",
    label: "国际出口",
    description: "符合欧美认证标准，含CE / REACH / CA65，支持OEM贴牌",
    items: [
      {
        id: "i-001",
        model: "PentaEU Hike 1P",
        spec: "210×90×110 cm",
        capacity: "1 Person",
        weight: "1.25 kg",
        material: "20D Nylon + Alu Poles",
        moq: 100,
        priceRanges: [
          { qty: "100–299", price: 32, currency: "USD" },
          { qty: "300–999", price: 27, currency: "USD" },
          { qty: "1000+", price: 22, currency: "USD" },
        ],
        features: ["CE Certified", "REACH Compliant", "OEM/ODM Available", "Custom Packaging"],
        inStock: true,
      },
      {
        id: "i-002",
        model: "PentaEU Hike 2P",
        spec: "210×130×115 cm",
        capacity: "2 Persons",
        weight: "1.85 kg",
        material: "20D Nylon + Alu Poles",
        moq: 100,
        priceRanges: [
          { qty: "100–299", price: 42, currency: "USD" },
          { qty: "300–999", price: 35, currency: "USD" },
          { qty: "1000+", price: 29, currency: "USD" },
        ],
        features: ["CE Certified", "REACH Compliant", "OEM/ODM Available", "Retail-Ready Box"],
        inStock: true,
      },
      {
        id: "i-003",
        model: "PentaUS Trail 2P",
        spec: "215×130×118 cm",
        capacity: "2 Persons",
        weight: "1.95 kg",
        material: "30D Nylon + Alu Poles",
        moq: 100,
        priceRanges: [
          { qty: "100–299", price: 48, currency: "USD" },
          { qty: "300–999", price: 40, currency: "USD" },
          { qty: "1000+", price: 33, currency: "USD" },
        ],
        features: ["CPSC / CA65 Compliant", "UPF 50+ Canopy", "OEM/ODM Available", "Amazon FBA Ready"],
        inStock: true,
      },
      {
        id: "i-004",
        model: "PentaUS Storm 3P",
        spec: "300×185×128 cm",
        capacity: "3 Persons",
        weight: "3.1 kg",
        material: "40D Nylon + DAC Poles",
        moq: 50,
        priceRanges: [
          { qty: "50–149", price: 88, currency: "USD" },
          { qty: "150–499", price: 74, currency: "USD" },
          { qty: "500+", price: 62, currency: "USD" },
        ],
        features: ["CPSC / CA65 Compliant", "3000mm Waterproof", "OEM/ODM Available", "REI / MEC Supplier"],
        inStock: false,
      },
      {
        id: "i-005",
        model: "PentaOEM Custom",
        spec: "定制规格",
        capacity: "定制",
        weight: "定制",
        material: "可选面料与帐杆",
        moq: 200,
        priceRanges: [
          { qty: "200–499", price: 0, currency: "USD" },
          { qty: "500+", price: 0, currency: "USD" },
        ],
        features: ["完全定制规格", "自有品牌贴标", "独立包装设计", "专属打样服务"],
        inStock: true,
      },
    ],
  },
];
