"use client";

import { PriceItem } from "@/lib/priceData";

interface PriceTableProps {
  items: PriceItem[];
  onInquire: (item: PriceItem) => void;
}

export default function PriceTable({ items, onInquire }: PriceTableProps) {
  return (
    <div className="space-y-4">
      {/* Desktop table */}
      <div className="hidden md:block overflow-x-auto rounded-lg border border-gray-200">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-600 text-xs uppercase tracking-wide">
            <tr>
              <th className="px-4 py-3 text-left">型号</th>
              <th className="px-4 py-3 text-left">规格 / 容量</th>
              <th className="px-4 py-3 text-left">重量 / 面料</th>
              <th className="px-4 py-3 text-left">起订量</th>
              <th className="px-4 py-3 text-left">阶梯价格 (USD)</th>
              <th className="px-4 py-3 text-left">功能</th>
              <th className="px-4 py-3 text-center">询价</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {items.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-4">
                  <div className="font-medium text-gray-900">{item.model}</div>
                  {!item.inStock && (
                    <span className="text-xs text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded mt-1 inline-block">
                      预订中
                    </span>
                  )}
                  {item.inStock && (
                    <span className="text-xs text-green-600 bg-green-50 px-1.5 py-0.5 rounded mt-1 inline-block">
                      现货
                    </span>
                  )}
                </td>
                <td className="px-4 py-4 text-gray-600">
                  <div>{item.spec}</div>
                  <div className="text-xs text-gray-400">{item.capacity}</div>
                </td>
                <td className="px-4 py-4 text-gray-600">
                  <div>{item.weight}</div>
                  <div className="text-xs text-gray-400">{item.material}</div>
                </td>
                <td className="px-4 py-4 text-gray-700 font-medium">
                  {item.moq} 件起
                </td>
                <td className="px-4 py-4">
                  <div className="space-y-1">
                    {item.priceRanges.map((range) => (
                      <div key={range.qty} className="flex items-center gap-2 text-xs">
                        <span className="text-gray-400 w-20 shrink-0">{range.qty} 件</span>
                        {range.price > 0 ? (
                          <span className="font-semibold text-green-700">
                            ${range.price}
                          </span>
                        ) : (
                          <span className="text-gray-400 italic">询价</span>
                        )}
                      </div>
                    ))}
                  </div>
                </td>
                <td className="px-4 py-4">
                  <div className="flex flex-wrap gap-1">
                    {item.features.map((f) => (
                      <span
                        key={f}
                        className="text-xs bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded"
                      >
                        {f}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="px-4 py-4 text-center">
                  <button
                    onClick={() => onInquire(item)}
                    className="px-3 py-1.5 bg-green-600 text-white text-xs font-medium rounded hover:bg-green-700 active:bg-green-800 transition-colors"
                  >
                    立即询价
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="md:hidden space-y-3">
        {items.map((item) => (
          <div
            key={item.id}
            className="border border-gray-200 rounded-lg p-4 bg-white"
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="font-semibold text-gray-900">{item.model}</div>
                <div className="text-xs text-gray-500 mt-0.5">{item.spec} · {item.capacity}</div>
              </div>
              {item.inStock ? (
                <span className="text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                  现货
                </span>
              ) : (
                <span className="text-xs text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
                  预订中
                </span>
              )}
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs text-gray-600 mb-3">
              <div>
                <span className="text-gray-400">重量：</span>{item.weight}
              </div>
              <div>
                <span className="text-gray-400">起订：</span>{item.moq} 件
              </div>
              <div className="col-span-2">
                <span className="text-gray-400">面料：</span>{item.material}
              </div>
            </div>

            <div className="mb-3">
              <div className="text-xs text-gray-400 mb-1">阶梯价格</div>
              <div className="flex flex-wrap gap-2">
                {item.priceRanges.map((range) => (
                  <div
                    key={range.qty}
                    className="flex items-center gap-1 bg-gray-50 rounded px-2 py-1 text-xs"
                  >
                    <span className="text-gray-500">{range.qty}件</span>
                    {range.price > 0 ? (
                      <span className="font-bold text-green-700">${range.price}</span>
                    ) : (
                      <span className="text-gray-400 italic">询价</span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-wrap gap-1 mb-3">
              {item.features.map((f) => (
                <span
                  key={f}
                  className="text-xs bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded"
                >
                  {f}
                </span>
              ))}
            </div>

            <button
              onClick={() => onInquire(item)}
              className="w-full py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 active:bg-green-800 transition-colors"
            >
              立即询价
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
