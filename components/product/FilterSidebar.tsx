'use client';

import React, { useState } from 'react';
import { mockCategories, mockBrands } from '@/lib/mock-data';

// ============================================
// BRAND COLORS — change these to update theme
// ============================================
const colors = {
  primary: '#22C55E',
  primaryHover: '#16A34A',
  secondary: '#0D1B2A',
  white: '#FFFFFF',
  border: '#E5E7EB',
  bgLight: '#F9FAFB',
  textMuted: '#6B7280',
};

export interface FilterState {
  categories: string[];
  brands: string[];
  priceMin: number;
  priceMax: number;
  rating: number | null;
  badge: string[];
}

interface FilterSidebarProps {
  filters: FilterState;
  onChange: (filters: FilterState) => void;
  className?: string;
}

const FilterSection = ({ title, children }: { title: string; children: React.ReactNode }) => {
  const [open, setOpen] = useState(true);
  return (
    <div style={{ borderBottom: `1px solid ${colors.border}` }} className="py-4">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between w-full text-left"
      >
        <span className="text-sm font-bold" style={{ color: colors.secondary }}>
          {title}
        </span>
        <svg
          width="14"
          height="14"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          viewBox="0 0 24 24"
          style={{
            color: colors.textMuted,
            transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.2s',
          }}
        >
          <path d="M19 9l-7 7-7-7" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      {open && <div className="mt-3">{children}</div>}
    </div>
  );
};

const FilterSidebar: React.FC<FilterSidebarProps> = ({ filters, onChange, className = '' }) => {
  const toggleCategory = (slug: string) => {
    const updated = filters.categories.includes(slug)
      ? filters.categories.filter((c) => c !== slug)
      : [...filters.categories, slug];
    onChange({ ...filters, categories: updated });
  };

  const toggleBrand = (slug: string) => {
    const updated = filters.brands.includes(slug)
      ? filters.brands.filter((b) => b !== slug)
      : [...filters.brands, slug];
    onChange({ ...filters, brands: updated });
  };

  const toggleBadge = (badge: string) => {
    const updated = filters.badge.includes(badge)
      ? filters.badge.filter((b) => b !== badge)
      : [...filters.badge, badge];
    onChange({ ...filters, badge: updated });
  };

  const hasActiveFilters =
    filters.categories.length > 0 ||
    filters.brands.length > 0 ||
    filters.badge.length > 0 ||
    filters.rating !== null ||
    filters.priceMin > 0 ||
    filters.priceMax < 500000;

  const resetFilters = () => {
    onChange({
      categories: [],
      brands: [],
      priceMin: 0,
      priceMax: 500000,
      rating: null,
      badge: [],
    });
  };

  return (
    <aside
      className={`flex flex-col rounded-xl p-4 ${className}`}
      style={{ backgroundColor: colors.white, border: `1px solid ${colors.border}` }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between pb-4"
        style={{ borderBottom: `1px solid ${colors.border}` }}
      >
        <h3 className="text-sm font-black" style={{ color: colors.secondary }}>
          Filters
        </h3>
        {hasActiveFilters && (
          <button
            onClick={resetFilters}
            className="text-xs font-semibold"
            style={{ color: colors.primary }}
          >
            Clear All
          </button>
        )}
      </div>

      {/* Categories */}
      <FilterSection title="Category">
        <div className="flex flex-col gap-2">
          {mockCategories.map((cat) => (
            <label key={cat.id} className="flex items-center gap-2.5 cursor-pointer group">
              <div
                onClick={() => toggleCategory(cat.slug)}
                className="w-4 h-4 rounded flex items-center justify-center flex-shrink-0 cursor-pointer transition-all duration-150"
                style={{
                  border: `2px solid ${filters.categories.includes(cat.slug) ? colors.primary : colors.border}`,
                  backgroundColor: filters.categories.includes(cat.slug)
                    ? colors.primary
                    : colors.white,
                }}
              >
                {filters.categories.includes(cat.slug) && (
                  <svg width="10" height="10" fill="none" stroke={colors.white} viewBox="0 0 24 24">
                    <path
                      d="M5 13l4 4L19 7"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={3}
                    />
                  </svg>
                )}
              </div>
              <span
                className="text-xs flex-1"
                style={{
                  color: filters.categories.includes(cat.slug)
                    ? colors.secondary
                    : colors.textMuted,
                }}
                onClick={() => toggleCategory(cat.slug)}
              >
                {cat.name}
              </span>
              <span className="text-xs" style={{ color: colors.textMuted }}>
                {cat.productCount}
              </span>
            </label>
          ))}
        </div>
      </FilterSection>

      {/* Price Range */}
      <FilterSection title="Price Range">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <div className="flex-1">
              <label className="text-xs mb-1 block" style={{ color: colors.textMuted }}>
                Min (₦)
              </label>
              <input
                type="number"
                value={filters.priceMin}
                onChange={(e) => onChange({ ...filters, priceMin: Number(e.target.value) })}
                className="w-full px-2 py-1.5 rounded text-xs focus:outline-none"
                style={{ border: `1px solid ${colors.border}`, color: colors.secondary }}
                placeholder="0"
                min={0}
              />
            </div>
            <span className="text-xs mt-4" style={{ color: colors.textMuted }}>
              —
            </span>
            <div className="flex-1">
              <label className="text-xs mb-1 block" style={{ color: colors.textMuted }}>
                Max (₦)
              </label>
              <input
                type="number"
                value={filters.priceMax}
                onChange={(e) => onChange({ ...filters, priceMax: Number(e.target.value) })}
                className="w-full px-2 py-1.5 rounded text-xs focus:outline-none"
                style={{ border: `1px solid ${colors.border}`, color: colors.secondary }}
                placeholder="500000"
                min={0}
              />
            </div>
          </div>
        </div>
      </FilterSection>

      {/* Brands */}
      <FilterSection title="Brand">
        <div className="flex flex-col gap-2">
          {mockBrands.map((brand) => (
            <label key={brand.id} className="flex items-center gap-2.5 cursor-pointer">
              <div
                onClick={() => toggleBrand(brand.slug)}
                className="w-4 h-4 rounded flex items-center justify-center flex-shrink-0 cursor-pointer transition-all duration-150"
                style={{
                  border: `2px solid ${filters.brands.includes(brand.slug) ? colors.primary : colors.border}`,
                  backgroundColor: filters.brands.includes(brand.slug)
                    ? colors.primary
                    : colors.white,
                }}
              >
                {filters.brands.includes(brand.slug) && (
                  <svg width="10" height="10" fill="none" stroke={colors.white} viewBox="0 0 24 24">
                    <path
                      d="M5 13l4 4L19 7"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={3}
                    />
                  </svg>
                )}
              </div>
              <span
                className="text-xs"
                style={{
                  color: filters.brands.includes(brand.slug) ? colors.secondary : colors.textMuted,
                }}
                onClick={() => toggleBrand(brand.slug)}
              >
                {brand.name}
              </span>
            </label>
          ))}
        </div>
      </FilterSection>

      {/* Rating */}
      <FilterSection title="Rating">
        <div className="flex flex-col gap-2">
          {[5, 4, 3].map((stars) => (
            <button
              key={stars}
              onClick={() =>
                onChange({ ...filters, rating: filters.rating === stars ? null : stars })
              }
              className="flex items-center gap-2 text-left"
              aria-label={`${stars} stars and above`}
            >
              <div className="flex items-center gap-0.5">
                {[1, 2, 3, 4, 5].map((s) => (
                  <svg
                    key={s}
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill={s <= stars ? '#F59E0B' : 'none'}
                    stroke="#F59E0B"
                    strokeWidth="2"
                  >
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                  </svg>
                ))}
              </div>
              <span className="text-xs" style={{ color: colors.textMuted }}>
                & above
              </span>
              {filters.rating === stars && (
                <span
                  className="ml-auto w-1.5 h-1.5 rounded-full"
                  style={{ backgroundColor: colors.primary }}
                />
              )}
            </button>
          ))}
        </div>
      </FilterSection>

      {/* Availability */}
      <FilterSection title="Availability">
        <div className="flex flex-col gap-2">
          {['sale', 'new', 'best-seller', 'hot'].map((badge) => (
            <label key={badge} className="flex items-center gap-2.5 cursor-pointer">
              <div
                onClick={() => toggleBadge(badge)}
                className="w-4 h-4 rounded flex items-center justify-center flex-shrink-0 cursor-pointer"
                style={{
                  border: `2px solid ${filters.badge.includes(badge) ? colors.primary : colors.border}`,
                  backgroundColor: filters.badge.includes(badge) ? colors.primary : colors.white,
                }}
              >
                {filters.badge.includes(badge) && (
                  <svg width="10" height="10" fill="none" stroke={colors.white} viewBox="0 0 24 24">
                    <path
                      d="M5 13l4 4L19 7"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={3}
                    />
                  </svg>
                )}
              </div>
              <span
                className="text-xs capitalize"
                style={{
                  color: filters.badge.includes(badge) ? colors.secondary : colors.textMuted,
                }}
                onClick={() => toggleBadge(badge)}
              >
                {badge.replace(/-/g, ' ')}
              </span>
            </label>
          ))}
        </div>
      </FilterSection>

      {/* Apply button */}
      <button
        className="mt-4 w-full py-2.5 rounded-md text-sm font-bold transition-all duration-200"
        style={{ backgroundColor: colors.primary, color: colors.white }}
        onMouseEnter={(e) =>
          ((e.currentTarget as HTMLElement).style.backgroundColor = colors.primaryHover)
        }
        onMouseLeave={(e) =>
          ((e.currentTarget as HTMLElement).style.backgroundColor = colors.primary)
        }
      >
        Apply Filters
      </button>
    </aside>
  );
};

export default FilterSidebar;
