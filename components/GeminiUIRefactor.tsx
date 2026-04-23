'use client'

import { useState, useMemo } from 'react'

/**
 * Gemini版本UI改造 v1.0
 * 专注成本-技术映射的UI展示
 *
 * 架构：
 * ┌─ 左侧输入面板（保留Gemini风格）
 * │
 * ├─ 右侧成本仪表板
 * │  ├─ 上：成本总数 + 成本分解图
 * │  ├─ 中：技术影响卡片（从成本推导）
 * │  └─ 下：优化建议 + SOP
 * │
 * └─ 底部：成本-技术决策矩阵
 */

// ────────────────────────────────────────────────────────────
// 数据接口（不改计算逻辑，只改显示）
// ────────────────────────────────────────────────────────────

interface CostBreakdownItem {
  name: string           // 原料名称
  cost: number          // 成本 ¥
  percentage: number    // 占比 %
  color: string         // 饼图颜色
}

interface TechImplications {
  id: string
  title: string         // 技术标题
  level: 'info' | 'warning' | 'critical'  // 优先级
  costDriver: string    // 成本驱动 (哪个原料导致这个问题)
  description: string   // 技术影响描述
  mitigation: string    // 缓解方案
  costImpact: string    // 成本影响 (节省或增加)
}

interface OptimizationSuggestion {
  id: string
  title: string
  currentCost: number
  optimizedCost: number
  savings: number
  technicalTrade: string  // 技术权衡是什么
  implementation: string  // 怎么实施
}

// ────────────────────────────────────────────────────────────
// 成本总览卡片
// ────────────────────────────────────────────────────────────

function CostSummary({
  unitCost,
  totalCost,
  change,
}: {
  unitCost: number
  totalCost: number
  change?: { value: number; direction: 'up' | 'down' }
}) {
  return (
    <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-lg p-6 mb-6 border border-slate-200">
      <div className="flex items-baseline justify-between mb-4">
        <div>
          <div className="text-sm font-medium text-slate-600 mb-1">单位成本</div>
          <div className="text-4xl font-bold text-slate-900 font-variant-numeric tabular-nums">
            ¥{unitCost.toLocaleString('zh-CN', { maximumFractionDigits: 0 })}
            <span className="text-lg text-slate-500 ml-1">/吨</span>
          </div>
        </div>
        {change && (
          <div className={`flex items-center gap-1 px-3 py-2 rounded-lg ${
            change.direction === 'up' ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'
          }`}>
            <span className="text-sm">{change.direction === 'up' ? '↑' : '↓'}</span>
            <span className="text-sm font-semibold">{Math.abs(change.value)}%</span>
          </div>
        )}
      </div>
      <div className="text-sm text-slate-600">
        预估总成本：¥{totalCost.toLocaleString('zh-CN', { maximumFractionDigits: 0 })}
      </div>
    </div>
  )
}

// ────────────────────────────────────────────────────────────
// 成本分解饼图容器
// ────────────────────────────────────────────────────────────

function CostBreakdownChart({ items }: { items: CostBreakdownItem[] }) {
  return (
    <div className="bg-white rounded-lg p-6 mb-6 border border-slate-200">
      <h3 className="text-sm font-semibold text-slate-900 mb-4">成本分解 Cost Breakdown</h3>

      {/* 简化版条形图（不引入新的chart库） */}
      <div className="space-y-3">
        {items.map((item) => (
          <div key={item.name}>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-slate-700">{item.name}</span>
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-slate-900">¥{item.cost.toLocaleString()}</span>
                <span className="text-xs text-slate-500 w-10 text-right">{item.percentage.toFixed(1)}%</span>
              </div>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-300"
                style={{
                  width: `${item.percentage}%`,
                  backgroundColor: item.color,
                }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* 颜色图例 */}
      <div className="grid grid-cols-2 gap-3 mt-6 pt-6 border-t border-slate-200">
        {items.map((item) => (
          <div key={`legend-${item.name}`} className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
            <span className="text-xs text-slate-600">{item.name}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ────────────────────────────────────────────────────────────
// 技术影响卡片
// ────────────────────────────────────────────────────────────

function TechImplicationCard({ item }: { item: TechImplications }) {
  const bgColor = {
    info: 'bg-blue-50 border-blue-200',
    warning: 'bg-amber-50 border-amber-200',
    critical: 'bg-red-50 border-red-200',
  }[item.level]

  const iconColor = {
    info: 'text-blue-600',
    warning: 'text-amber-600',
    critical: 'text-red-600',
  }[item.level]

  const icon = {
    info: '✅',
    warning: '⚠️',
    critical: '⚠️',
  }[item.level]

  return (
    <div className={`rounded-lg p-4 border ${bgColor}`}>
      <div className="flex gap-3">
        <div className="text-xl">{icon}</div>
        <div className="flex-1 min-w-0">
          <div className="font-semibold text-sm text-slate-900 mb-1">{item.title}</div>

          <div className="text-xs text-slate-700 mb-2 space-y-1">
            <div><strong>成本驱动：</strong> {item.costDriver}</div>
            <div><strong>技术影响：</strong> {item.description}</div>
          </div>

          <div className="bg-white bg-opacity-60 rounded px-3 py-2 text-xs text-slate-700 mb-2">
            💡 <strong>解决方案：</strong> {item.mitigation}
          </div>

          <div className={`text-xs font-medium ${
            item.costImpact.includes('省') ? 'text-green-700' : 'text-slate-600'
          }`}>
            {item.costImpact}
          </div>
        </div>
      </div>
    </div>
  )
}

// ────────────────────────────────────────────────────────────
// 优化建议卡片
// ────────────────────────────────────────────────────────────

function OptimizationCard({ item }: { item: OptimizationSuggestion }) {
  const savings = item.currentCost - item.optimizedCost
  const savingsPercent = ((savings / item.currentCost) * 100).toFixed(1)

  return (
    <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-4 border border-green-200">
      <div className="flex justify-between items-start mb-3">
        <h4 className="font-semibold text-slate-900 text-sm">{item.title}</h4>
        <div className="text-right">
          <div className="text-xs text-slate-600">可节省</div>
          <div className="text-lg font-bold text-green-600">¥{savings.toLocaleString()}</div>
          <div className="text-xs text-green-600">-{savingsPercent}%</div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 mb-3">
        <div className="bg-white bg-opacity-60 rounded px-2 py-1">
          <div className="text-xs text-slate-600">当前成本</div>
          <div className="text-sm font-semibold text-slate-900">¥{item.currentCost.toLocaleString()}</div>
        </div>
        <div className="bg-white bg-opacity-60 rounded px-2 py-1">
          <div className="text-xs text-slate-600">优化后</div>
          <div className="text-sm font-semibold text-green-700">¥{item.optimizedCost.toLocaleString()}</div>
        </div>
      </div>

      <div className="text-xs text-slate-700 space-y-1 mb-2">
        <div><strong>技术权衡：</strong> {item.technicalTrade}</div>
        <div><strong>实施方式：</strong> {item.implementation}</div>
      </div>

      <button className="w-full bg-green-600 hover:bg-green-700 text-white text-xs font-semibold py-2 rounded transition-colors">
        采用此方案
      </button>
    </div>
  )
}

// ────────────────────────────────────────────────────────────
// 成本-技术决策矩阵
// ────────────────────────────────────────────────────────────

function CostTechMatrix() {
  const scenarios = [
    {
      budget: '¥1800',
      description: '经济版',
      keyDecision: '国产APP 70% + 国产MEL',
      techRisks: ['APP杂质多', '水分含量可能>1%'],
      mitigation: '温度控制 ≤80°C | 分阶段固化',
      suitable: '小订单试产',
    },
    {
      budget: '¥2500',
      description: '标准版',
      keyDecision: '进口APP 71% + 国产MEL',
      techRisks: ['性能稳定'],
      mitigation: '标准工艺',
      suitable: '常规生产',
    },
    {
      budget: '¥3200',
      description: '高端版',
      keyDecision: '进口APP 73% + 进口MEL',
      techRisks: ['无'],
      mitigation: '可选纳米填料强化',
      suitable: '高端产品',
    },
  ]

  return (
    <div className="bg-white rounded-lg p-6 border border-slate-200">
      <h3 className="text-sm font-semibold text-slate-900 mb-4">成本-技术决策矩阵</h3>

      <div className="space-y-3">
        {scenarios.map((scenario, idx) => (
          <div
            key={idx}
            className={`border-l-4 p-4 rounded-lg ${
              idx === 0 ? 'border-blue-400 bg-blue-50' :
              idx === 1 ? 'border-green-400 bg-green-50' :
              'border-purple-400 bg-purple-50'
            }`}
          >
            <div className="flex justify-between items-start mb-2">
              <div>
                <div className="text-2xl font-bold text-slate-900">{scenario.budget}</div>
                <div className="text-xs text-slate-600 font-medium">{scenario.description}</div>
              </div>
              <span className="text-xs font-semibold text-slate-600 bg-white bg-opacity-70 px-2 py-1 rounded">
                {scenario.suitable}
              </span>
            </div>

            <div className="text-xs space-y-2 text-slate-700">
              <div><strong>原料选择：</strong> {scenario.keyDecision}</div>
              <div><strong>技术风险：</strong> {scenario.techRisks.join(' | ') || '无'}</div>
              <div><strong>工艺方案：</strong> {scenario.mitigation}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ────────────────────────────────────────────────────────────
// SOP 检查清单
// ────────────────────────────────────────────────────────────

function SOPChecklist() {
  const items = [
    {
      category: '原料准备',
      tasks: [
        '检查APP含水量 (<0.5%)',
        '确认PER纯度等级',
        '验证MEL含氮量 (>66%)',
      ],
    },
    {
      category: '混合工艺',
      tasks: [
        '混合温度设定 (50-120°C)',
        '搅拌时间控制 (<30min)',
        '避免长时间加热',
      ],
    },
    {
      category: '固化过程',
      tasks: [
        '分阶段升温 (<5°C/min)',
        '监测放热曲线',
        '防止热失控',
      ],
    },
  ]

  return (
    <div className="bg-white rounded-lg p-6 border border-slate-200">
      <h3 className="text-sm font-semibold text-slate-900 mb-4 flex items-center gap-2">
        <span className="text-lg">✅</span>
        工艺检查清单 SOP Checklist
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {items.map((group, idx) => (
          <div key={idx} className="bg-slate-50 rounded p-4 border border-slate-200">
            <h4 className="font-semibold text-sm text-slate-900 mb-3">{group.category}</h4>
            <ul className="space-y-2">
              {group.tasks.map((task, taskIdx) => (
                <li key={taskIdx} className="flex items-start gap-2 text-xs text-slate-700">
                  <input
                    type="checkbox"
                    className="mt-1 rounded accent-green-600"
                    disabled
                  />
                  <span>{task}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  )
}

// ────────────────────────────────────────────────────────────
// 主仪表板组件
// ────────────────────────────────────────────────────────────

export default function GeminiUIRefactor() {
  // 示例数据（实际应从calculator.ts计算得出）
  const [unitCost] = useState(2500)
  const [totalCost] = useState(250000)

  const costBreakdown: CostBreakdownItem[] = [
    { name: 'APP 聚磷酸铵', cost: 1000, percentage: 40, color: '#ef4444' },
    { name: 'PER 季戊四醇', cost: 800, percentage: 32, color: '#f97316' },
    { name: 'MEL 三聚氰胺', cost: 700, percentage: 28, color: '#3b82f6' },
  ]

  const techImplications: TechImplications[] = [
    {
      id: '1',
      title: 'APP成本占比最高',
      level: 'info',
      costDriver: 'APP ¥1000 (占40%)',
      description: '聚磷酸铵是成本大头，直接影响阻燃效能和产品定价',
      mitigation: '可尝试P₂O₅含量70%的低端等级，节省¥200-300但需加强工艺控制',
      costImpact: '可节省¥200-300/吨',
    },
    {
      id: '2',
      title: 'PER纯度选择影响性能',
      level: 'warning',
      costDriver: 'PER ¥800 (占32%)',
      description: '95%纯度vs 98%纯度相差¥400，但成炭效率可能相差8-10%',
      mitigation: '95%纯度足够满足GB标准，除非是高端应用才升级到98%',
      costImpact: '95%纯度可节省¥300-400/吨',
    },
    {
      id: '3',
      title: 'MEL用量与膨胀倍率',
      level: 'info',
      costDriver: 'MEL ¥700 (占28%)',
      description: 'MEL用量越多，炭层膨胀倍率越高，但过量会导致炭层疏松',
      mitigation: '根据目标耐火等级调整：30min需18%，120min需24%',
      costImpact: '精准用量可降低MEL浪费3-5%',
    },
  ]

  const optimizations: OptimizationSuggestion[] = [
    {
      id: '1',
      title: '降级APP纯度',
      currentCost: 1000,
      optimizedCost: 750,
      savings: 250,
      technicalTrade: '阻燃效能下降~8%，需通过增加MEL补偿',
      implementation: '选用国产P₂O₅ 70%产品 + 增加MEL用量15%',
    },
    {
      id: '2',
      title: '采用95%纯度PER',
      currentCost: 800,
      optimizedCost: 500,
      savings: 300,
      technicalTrade: '成炭效率降3-5%，影响微小',
      implementation: '从98%降级到95%，成本节省显著',
    },
  ]

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* 标题 */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">成本驱动的配方优化</h1>
          <p className="text-slate-600">Cost-Driven Formulation Optimization Dashboard</p>
        </div>

        {/* 左右布局 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* 左侧：输入面板占位符 */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg p-6 border border-slate-200 sticky top-6">
              <h2 className="font-semibold text-slate-900 mb-4">原料配置 Materials</h2>
              <div className="space-y-4 text-sm text-slate-600">
                <p className="text-xs">
                  📌 左侧为原料输入面板<br/>
                  保留Gemini版本的BOM表和工艺参数输入
                </p>
                <div className="p-3 bg-blue-50 rounded border border-blue-200 text-blue-700 text-xs">
                  ℹ️ 这里放原有的输入控件：<br/>
                  - 原料选择<br/>
                  - 数量、纯度、价格<br/>
                  - 工艺参数
                </div>
              </div>
            </div>
          </div>

          {/* 右侧：成本仪表板 */}
          <div className="lg:col-span-2">
            {/* 成本总览 */}
            <CostSummary unitCost={unitCost} totalCost={totalCost} change={{ value: 2.5, direction: 'down' }} />

            {/* 成本分解 */}
            <CostBreakdownChart items={costBreakdown} />

            {/* 技术影响卡片网格 */}
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-slate-900 mb-3">成本驱动的技术影响</h3>
              <div className="grid grid-cols-1 gap-3">
                {techImplications.map((item) => (
                  <TechImplicationCard key={item.id} item={item} />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 优化建议 */}
        <div className="mb-8">
          <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
            <span className="text-2xl">💡</span>
            优化方案对标 Optimization Options
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {optimizations.map((item) => (
              <OptimizationCard key={item.id} item={item} />
            ))}
          </div>
        </div>

        {/* 成本-技术决策矩阵 */}
        <div className="mb-8">
          <CostTechMatrix />
        </div>

        {/* SOP检查清单 */}
        <div className="mb-8">
          <SOPChecklist />
        </div>

        {/* 底部说明 */}
        <div className="bg-blue-50 rounded-lg p-6 border border-blue-200 text-sm text-slate-700">
          <h3 className="font-semibold text-slate-900 mb-2">📌 UI改造说明</h3>
          <ul className="list-disc list-inside space-y-1 text-xs text-slate-600">
            <li>左侧输入面板保留Gemini原有设计（BOM表、参数设置）</li>
            <li>右侧改为成本优先的仪表板（成本总数 → 成本分解 → 技术影响 → 优化方案）</li>
            <li>所有技术卡片都关联到具体的成本驱动因素</li>
            <li>优化建议显示具体的成本-技术权衡（省多少钱，失多少性能）</li>
            <li>底部矩阵帮助用户快速选择成本档位</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
