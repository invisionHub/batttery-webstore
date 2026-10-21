'use client';

import React, { useState } from 'react';

export interface FilterState {
  categories: string[];
  subcategories: string[];
  series: string[];
  brands: string[];
  priceMin: number;
  priceMax: number;
  rating: number | null;
  inStockOnly: boolean;
}

export interface FilterOption {
  id: string;
  name: string;
  value: string;
  count: number;
}

export interface FilterSidebarProps {
  filters: FilterState;
  onChange: (filters: FilterState) => void;
  categories?: FilterOption[];
  subcategories?: FilterOption[];
  series?: FilterOption[];
  brands?: FilterOption[];
  className?: string;
}

const FilterSection: React.FC<{
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
  badge?: number;
}> = ({ title, children, defaultOpen = true, badge }) => {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-slate-200/80 pb-4 mb-4 last:border-b-0 last:mb-0 last:pb-0">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between w-full text-left py-1 text-xs font-bold uppercase tracking-wider text-slate-800 hover:text-[#CC0000] transition-colors cursor-pointer"
      >
        <span className="flex items-center gap-2">
          {title}
          {badge !== undefined && badge > 0 && (
            <span className="bg-[#CC0000] text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full">
              {badge}
            </span>
          )}
        </span>
        <svg
          width="14"
          height="14"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          viewBox="0 0 24 24"
          className={`transform transition-transform duration-200 text-slate-400 ${
            open ? 'rotate-180' : 'rotate-0'
          }`}
        >
          <path d="M19 9l-7 7-7-7" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      {open && <div className="mt-3">{children}</div>}
    </div>
  );
};

const CheckItem: React.FC<{
  label: string;
  checked: boolean;
  count?: number;
  onChange: () => void;
}> = ({ label, checked, count, onChange }) => (
  <label className="flex items-center gap-2.5 cursor-pointer py-1 group select-none">
    <div
      onClick={onChange}
      className={`w-4 h-4 rounded-md border flex items-center justify-center shrink-0 transition-colors ${
        checked
          ? 'bg-[#CC0000] border-[#CC0000]'
          : 'bg-white border-slate-300 group-hover:border-slate-400'
      }`}
    >
      {checked && (
        <svg width="10" height="10" fill="none" stroke="#FFFFFF" strokeWidth="3" viewBox="0 0 24 24">
          <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
    </div>
    <span
      onClick={onChange}
      className={`text-xs flex-1 truncate transition-colors ${
        checked ? 'font-bold text-slate-900' : 'text-slate-600 group-hover:text-slate-900'
      }`}
    >
      {label}
    </span>
    {count !== undefined && (
      <span className="text-[11px] font-medium text-slate-400 tabular-nums">({count})</span>
    )}
  </label>
);

export const FilterSidebar: React.FC<FilterSidebarProps> = ({
  filters,
  onChange,
  categories = [],
  subcategories = [],
  series = [],
  className = '',
}) => {
  const [priceMin, setPriceMin] = useState(String(filters.priceMin || 0));
  const [priceMax, setPriceMax] = useState(String(filters.priceMax || 1000000));

  const toggleCategory = (val: string) => {
    const list = filters.categories || [];
    const updated = list.includes(val) ? list.filter((c) => c !== val) : [...list, val];
    onChange({ ...filters, categories: updated });
  };

  const toggleSubcategory = (val: string) => {
    const list = filters.subcategories || [];
    const updated = list.includes(val) ? list.filter((s) => s !== val) : [...list, val];
    onChange({ ...filters, subcategories: updated });
  };

  const toggleSeries = (val: string) => {
    const list = filters.series || [];
    const updated = list.includes(val) ? list.filter((s) => s !== val) : [...list, val];
    onChange({ ...filters, series: updated });
  };

  const applyPrice = () => {
    const min = Math.max(0, parseInt(priceMin, 10) || 0);
    const max = Math.max(min, parseInt(priceMax, 10) || 1000000);
    onChange({
      ...filters,
      priceMin: min,
      priceMax: max,
    });
  };

  const activeFiltersCount =
    (filters.categories?.length || 0) +
    (filters.subcategories?.length || 0) +
    (filters.series?.length || 0) +
    (filters.brands?.length || 0) +
    (filters.inStockOnly ? 1 : 0) +
    (filters.priceMin > 0 || (filters.priceMax && filters.priceMax < 1000000) ? 1 : 0);

  const resetAll = () => {
    setPriceMin('0');
    setPriceMax('1000000');
    onChange({
      categories: [],
      subcategories: [],
      series: [],
      brands: [],
      priceMin: 0,
      priceMax: 1000000,
      rating: null,
      inStockOnly: false,
    });
  };

  return (
    <aside
      className={`bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs ${className}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between pb-3.5 mb-4 border-b border-slate-200">
        <div className="flex items-center gap-2">
          <span className="text-sm font-extrabold text-slate-900 tracking-tight">Catalog Filters</span>
          {activeFiltersCount > 0 && (
            <span className="bg-[#CC0000] text-white text-[11px] font-bold px-2 py-0.5 rounded-full">
              {activeFiltersCount}
            </span>
          )}
        </div>
        {activeFiltersCount > 0 && (
          <button
            onClick={resetAll}
            className="text-xs font-bold text-[#CC0000] hover:text-[#990000] transition-colors cursor-pointer"
          >
            Clear All
          </button>
        )}
      </div>

      {/* ── 1. CATEGORIES ── */}
      {categories.length > 0 && (
        <FilterSection title="Product Category" defaultOpen={true} badge={filters.categories?.length}>
          <div className="space-y-0.5 max-h-56 overflow-y-auto pr-1">
            {categories.map((cat) => (
              <CheckItem
                key={cat.id}
                label={cat.name}
                checked={(filters.categories || []).includes(cat.value)}
                count={cat.count}
                onChange={() => toggleCategory(cat.value)}
              />
            ))}
          </div>
        </FilterSection>
      )}

      {/* ── 2. SERIES & COLLECTIONS ── */}
      {series.length > 0 && (
        <FilterSection title="Series & Range" defaultOpen={true} badge={filters.series?.length}>
          <div className="space-y-0.5 max-h-52 overflow-y-auto pr-1">
            {series.map((s) => (
              <CheckItem
                key={s.id}
                label={s.name}
                checked={(filters.series || []).includes(s.value)}
                count={s.count}
                onChange={() => toggleSeries(s.value)}
              />
            ))}
          </div>
        </FilterSection>
      )}

      {/* ── 3. SUBCATEGORIES ── */}
      {subcategories.length > 0 && (
        <FilterSection title="Subcategory" defaultOpen={false} badge={filters.subcategories?.length}>
          <div className="space-y-0.5 max-h-60 overflow-y-auto pr-1">
            {subcategories.map((sub) => (
              <CheckItem
                key={sub.id}
                label={sub.name}
                checked={(filters.subcategories || []).includes(sub.value)}
                count={sub.count}
                onChange={() => toggleSubcategory(sub.value)}
              />
            ))}
          </div>
        </FilterSection>
      )}

      {/* ── 4. PRICE RANGE ── */}
      <FilterSection title="Price Range (₦)" defaultOpen={false}>
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[10px] font-semibold text-slate-400 block mb-1">MIN</label>
              <input
                type="number"
                value={priceMin}
                onChange={(e) => setPriceMin(e.target.value)}
                onBlur={applyPrice}
                placeholder="0"
                className="w-full text-xs font-semibold px-2.5 py-1.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#CC0000] tabular-nums"
              />
            </div>
            <div>
              <label className="text-[10px] font-semibold text-slate-400 block mb-1">MAX</label>
              <input
                type="number"
                value={priceMax}
                onChange={(e) => setPriceMax(e.target.value)}
                onBlur={applyPrice}
                placeholder="1000000"
                className="w-full text-xs font-semibold px-2.5 py-1.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#CC0000] tabular-nums"
              />
            </div>
          </div>

          {/* Quick presets */}
          <div className="flex flex-col gap-1.5 pt-1">
            {[
              { label: 'Under ₦10,000', min: 0, max: 10000 },
              { label: '₦10,000 — ₦50,000', min: 10000, max: 50000 },
              { label: '₦50,000 — ₦150,000', min: 50000, max: 150000 },
              { label: '₦150,000 — ₦500,000', min: 150000, max: 500000 },
              { label: 'Above ₦500,000', min: 500000, max: 1000000 },
            ].map((range) => {
              const active = filters.priceMin === range.min && filters.priceMax === range.max;
              return (
                <button
                  key={range.label}
                  onClick={() => {
                    setPriceMin(String(range.min));
                    setPriceMax(String(range.max));
                    onChange({ ...filters, priceMin: range.min, priceMax: range.max });
                  }}
                  className={`text-left text-xs py-1 px-2 rounded-md transition-colors cursor-pointer ${
                    active
                      ? 'bg-red-50 text-[#CC0000] font-bold'
                      : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  {range.label}
                </button>
              );
            })}
          </div>
        </div>
      </FilterSection>

      {/* ── 5. AVAILABILITY ── */}
      <FilterSection title="Availability" defaultOpen={false}>
        <CheckItem
          label="In Stock Only"
          checked={Boolean(filters.inStockOnly)}
          onChange={() => onChange({ ...filters, inStockOnly: !filters.inStockOnly })}
        />
      </FilterSection>

      {/* Apply Button */}
      <button
        onClick={applyPrice}
        className="w-full mt-2 py-2.5 bg-slate-900 hover:bg-[#CC0000] text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
      >
        Apply Price Range
      </button>
    </aside>
  );
};

export default FilterSidebar;
