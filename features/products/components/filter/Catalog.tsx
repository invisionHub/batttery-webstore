'use client';

import React from 'react';

interface CatalogProps {
  categoryOptions: {
    id: string;
    name: string;
    value: string;
    count: number;
  }[];
  selected: string[];
  onSelectCategory?: (categoryValue: string | null) => void;
}

export function Catalog({ categoryOptions, selected, onSelectCategory }: CatalogProps) {
  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-6 no-scrollbar scroll-smooth">
      <button
        onClick={() => onSelectCategory?.(null)}
        className={`shrink-0 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-2xs cursor-pointer ${
          selected.length === 0
            ? 'bg-[#CC0000] text-white shadow-red-900/20'
            : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-300 hover:text-slate-900'
        }`}
      >
        All Products
      </button>

      {categoryOptions.map((cat) => {
        const isSelected = selected.includes(cat.value);
        return (
          <button
            key={cat.id}
            onClick={() => onSelectCategory?.(cat.value)}
            className={`shrink-0 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-2xs cursor-pointer flex items-center gap-1.5 ${
              isSelected
                ? 'bg-[#CC0000] text-white shadow-red-900/20'
                : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-300 hover:text-slate-900'
            }`}
          >
            <span>{cat.name}</span>
            {cat.count > 0 && (
              <span
                className={`text-[10px] font-semibold px-1.5 py-0.2 rounded-full tabular-nums ${
                  isSelected ? 'bg-white/25 text-white' : 'bg-slate-100 text-slate-500'
                }`}
              >
                {cat.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}