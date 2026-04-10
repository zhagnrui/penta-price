"use client";

import { SeasonType } from "@/lib/priceData";

interface Tab {
  key: SeasonType;
  label: string;
}

interface TabNavProps {
  tabs: Tab[];
  active: SeasonType;
  onChange: (key: SeasonType) => void;
}

export default function TabNav({ tabs, active, onChange }: TabNavProps) {
  return (
    <div className="flex border-b border-gray-200 mb-6">
      {tabs.map((tab) => (
        <button
          key={tab.key}
          onClick={() => onChange(tab.key)}
          className={`
            px-5 py-3 text-sm font-medium transition-colors relative
            ${
              active === tab.key
                ? "text-green-700 border-b-2 border-green-600 -mb-px"
                : "text-gray-500 hover:text-gray-700"
            }
          `}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
