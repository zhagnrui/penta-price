"use client";

import { useState } from "react";
import { priceData, SeasonType, PriceItem } from "@/lib/priceData";
import TabNav from "@/components/TabNav";
import PriceTable from "@/components/PriceTable";
import InquiryModal from "@/components/InquiryModal";

const tabs = priceData.map(({ key, label }) => ({ key, label }));

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<SeasonType>("single");
  const [inquiryItem, setInquiryItem] = useState<PriceItem | null>(null);

  const activeCategory = priceData.find((c) => c.key === activeTab)!;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M3 12l9-9 9 9M5 10v9a1 1 0 001 1h4v-5h4v5h4a1 1 0 001-1v-9" />
              </svg>
            </div>
            <span className="font-bold text-gray-900 text-lg tracking-tight">Penta Outdoors</span>
          </div>
          <a
            href="mailto:sales@penta.com"
            className="hidden sm:flex items-center gap-1.5 text-sm text-green-700 font-medium hover:underline"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            sales@penta.com
          </a>
        </div>
      </header>

      {/* Hero */}
      <div className="bg-gradient-to-br from-green-700 to-green-900 text-white py-10 px-4">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-2xl sm:text-3xl font-bold mb-2">帐篷批发价格表</h1>
          <p className="text-green-200 text-sm sm:text-base max-w-xl">
            工厂直供 · 支持 OEM/ODM · CE / REACH / CA65 认证 · 全球发货
          </p>
          <div className="flex flex-wrap gap-4 mt-4 text-xs text-green-100">
            <span className="flex items-center gap-1">
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              1-2 日报价响应
            </span>
            <span className="flex items-center gap-1">
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              免费打样（500+ 件）
            </span>
            <span className="flex items-center gap-1">
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              FOB / CIF 均可
            </span>
          </div>
        </div>
      </div>

      {/* Main content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <TabNav tabs={tabs} active={activeTab} onChange={setActiveTab} />

        <p className="text-sm text-gray-500 mb-6">{activeCategory.description}</p>

        <PriceTable
          items={activeCategory.items}
          onInquire={setInquiryItem}
        />

        {/* Notes */}
        <div className="mt-8 bg-amber-50 border border-amber-200 rounded-lg p-4 text-xs text-amber-800 space-y-1">
          <p className="font-medium">价格说明</p>
          <p>· 以上价格为参考含税出厂价（USD），不含运费，具体报价以询价确认为准。</p>
          <p>· 价格有效期：30 天（受原材料及汇率浮动影响）。</p>
          <p>· OEM 定制型号（PentaOEM Custom）需提供设计文件后另行报价。</p>
          <p>· 图片及规格如有更改，以最新样品为准。</p>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 mt-12 py-6 text-center text-xs text-gray-400">
        <p>© 2024 Penta Outdoors · 专业户外装备制造商 · All rights reserved.</p>
      </footer>

      {/* Inquiry modal */}
      <InquiryModal item={inquiryItem} onClose={() => setInquiryItem(null)} />
    </div>
  );
}
