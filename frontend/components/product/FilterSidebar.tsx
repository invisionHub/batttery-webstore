'use client';

import React, { useState } from 'react';

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
  inStockOnly: boolean;
}

interface FilterOption {
  id: string;
  name: string;
  value: string;
  count: number;
}

interface FilterSidebarProps {
  filters: FilterState;
  onChange: (filters: FilterState) => void;
  categories?: FilterOption[];
  brands?: FilterOption[];
  className?: string;
}

// ─────────────────────────────────────────
// Collapsible filter section
// ─────────────────────────────────────────
const FilterSection = ({
  title,
  children,
  defaultOpen = true,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) => {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div
      style={{
        borderBottom: `1px solid ${colors.border}`,
        paddingBottom: '16px',
        marginBottom: '16px',
      }}
    >
      <button
        onClick={() => setOpen(!open)}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '100%',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          padding: '0 0 12px 0',
        }}
      >
        <span style={{ fontSize: '13px', fontWeight: 700, color: colors.secondary }}>{title}</span>
        <svg
          width="14"
          height="14"
          fill="none"
          stroke={colors.textMuted}
          strokeWidth="2.5"
          viewBox="0 0 24 24"
          style={{
            transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.2s',
          }}
        >
          <path d="M19 9l-7 7-7-7" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      {open && <div>{children}</div>}
    </div>
  );
};

// ─────────────────────────────────────────
// Custom checkbox
// ─────────────────────────────────────────
const CheckItem = ({
  label,
  checked,
  count,
  onChange,
}: {
  label: string;
  checked: boolean;
  count?: number;
  onChange: () => void;
}) => (
  <label
    style={{
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      cursor: 'pointer',
      marginBottom: '10px',
    }}
  >
    <div
      onClick={onChange}
      style={{
        width: '16px',
        height: '16px',
        borderRadius: '4px',
        border: `2px solid ${checked ? colors.primary : colors.border}`,
        backgroundColor: checked ? colors.primary : colors.white,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        cursor: 'pointer',
        transition: 'all 0.15s',
      }}
    >
      {checked && (
        <svg width="9" height="9" fill="none" stroke={colors.white} viewBox="0 0 24 24">
          <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} />
        </svg>
      )}
    </div>
    <span
      onClick={onChange}
      style={{
        fontSize: '13px',
        color: checked ? colors.secondary : colors.textMuted,
        flex: 1,
        cursor: 'pointer',
      }}
    >
      {label}
    </span>
    {count !== undefined && (
      <span style={{ fontSize: '11px', color: colors.textMuted }}>({count})</span>
    )}
  </label>
);

// ─────────────────────────────────────────
// MAIN FILTER SIDEBAR
// ─────────────────────────────────────────
const FilterSidebar: React.FC<FilterSidebarProps> = ({
  filters,
  onChange,
  categories = [],
  brands = [],
  className = '',
}) => {
  const [priceMin, setPriceMin] = useState(String(filters.priceMin));
  const [priceMax, setPriceMax] = useState(String(filters.priceMax));

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

  const applyPrice = () => {
    onChange({
      ...filters,
      priceMin: Number(priceMin) || 0,
      priceMax: Number(priceMax) || 500000,
    });
  };

  const hasActive =
    filters.categories.length > 0 ||
    filters.brands.length > 0 ||
    filters.rating !== null ||
    filters.inStockOnly ||
    filters.priceMin > 0 ||
    filters.priceMax < 500000;

  const reset = () => {
    setPriceMin('0');
    setPriceMax('500000');
    onChange({
      categories: [],
      brands: [],
      priceMin: 0,
      priceMax: 500000,
      rating: null,
      inStockOnly: false,
    });
  };

  return (
    <aside
      className={className}
      style={{
        backgroundColor: colors.white,
        border: `1px solid ${colors.border}`,
        borderRadius: '12px',
        padding: '16px',
      }}
    >
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '16px',
          paddingBottom: '12px',
          borderBottom: `1px solid ${colors.border}`,
        }}
      >
        <span style={{ fontSize: '14px', fontWeight: 800, color: colors.secondary }}>Filters</span>
        {hasActive && (
          <button
            onClick={reset}
            style={{
              fontSize: '12px',
              fontWeight: 600,
              color: colors.primary,
              background: 'none',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            Clear All
          </button>
        )}
      </div>

      {/* ── CATEGORY FILTER ── */}
      <FilterSection title="Category">
        {categories.map((cat) => (
          <CheckItem
            key={cat.id}
            label={cat.name}
            checked={filters.categories.includes(cat.value)}
            count={cat.count}
            onChange={() => toggleCategory(cat.value)}
          />
        ))}
      </FilterSection>

      {/* ── PRICE RANGE FILTER ── */}
      <FilterSection title="Price Range">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {/* Price inputs */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ flex: 1 }}>
              <label
                style={{
                  fontSize: '11px',
                  color: colors.textMuted,
                  display: 'block',
                  marginBottom: '4px',
                }}
              >
                Min (₦)
              </label>
              <input
                type="number"
                value={priceMin}
                onChange={(e) => setPriceMin(e.target.value)}
                onBlur={applyPrice}
                placeholder="0"
                style={{
                  width: '100%',
                  padding: '6px 8px',
                  fontSize: '12px',
                  border: `1px solid ${colors.border}`,
                  borderRadius: '6px',
                  color: colors.secondary,
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
            </div>
            <span style={{ color: colors.textMuted, fontSize: '12px', marginTop: '16px' }}>—</span>
            <div style={{ flex: 1 }}>
              <label
                style={{
                  fontSize: '11px',
                  color: colors.textMuted,
                  display: 'block',
                  marginBottom: '4px',
                }}
              >
                Max (₦)
              </label>
              <input
                type="number"
                value={priceMax}
                onChange={(e) => setPriceMax(e.target.value)}
                onBlur={applyPrice}
                placeholder="500000"
                style={{
                  width: '100%',
                  padding: '6px 8px',
                  fontSize: '12px',
                  border: `1px solid ${colors.border}`,
                  borderRadius: '6px',
                  color: colors.secondary,
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
            </div>
          </div>

          {/* Quick price ranges */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '4px' }}>
            {[
              { label: 'Under ₦10,000', min: 0, max: 10000 },
              { label: '₦10,000 — ₦50,000', min: 10000, max: 50000 },
              { label: '₦50,000 — ₦100,000', min: 50000, max: 100000 },
              { label: 'Above ₦100,000', min: 100000, max: 500000 },
            ].map((range) => (
              <button
                key={range.label}
                onClick={() => {
                  setPriceMin(String(range.min));
                  setPriceMax(String(range.max));
                  onChange({ ...filters, priceMin: range.min, priceMax: range.max });
                }}
                style={{
                  textAlign: 'left',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '12px',
                  color:
                    filters.priceMin === range.min && filters.priceMax === range.max
                      ? colors.primary
                      : colors.textMuted,
                  fontWeight:
                    filters.priceMin === range.min && filters.priceMax === range.max ? 600 : 400,
                  padding: '2px 0',
                }}
              >
                {range.label}
              </button>
            ))}
          </div>
        </div>
      </FilterSection>

      {/* ── BRAND FILTER ── */}
      <FilterSection title="Brand">
        {brands.map((brand) => (
          <CheckItem
            key={brand.id}
            label={brand.name}
            checked={filters.brands.includes(brand.value)}
            count={brand.count}
            onChange={() => toggleBrand(brand.value)}
          />
        ))}
      </FilterSection>

      {/* ── RATING FILTER ── */}
      <FilterSection title="Rating">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {[5, 4, 3, 2].map((stars) => (
            <button
              key={stars}
              onClick={() =>
                onChange({ ...filters, rating: filters.rating === stars ? null : stars })
              }
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: 0,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
                {[1, 2, 3, 4, 5].map((s) => (
                  <svg
                    key={s}
                    width="13"
                    height="13"
                    viewBox="0 0 24 24"
                    fill={s <= stars ? '#F59E0B' : 'none'}
                    stroke="#F59E0B"
                    strokeWidth="2"
                  >
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                  </svg>
                ))}
              </div>
              <span style={{ fontSize: '12px', color: colors.textMuted }}>& above</span>
              {filters.rating === stars && (
                <span
                  style={{
                    marginLeft: 'auto',
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    backgroundColor: colors.primary,
                  }}
                />
              )}
            </button>
          ))}
        </div>
      </FilterSection>

      {/* ── AVAILABILITY ── */}
      <FilterSection title="Availability" defaultOpen={false}>
        <CheckItem
          label="In Stock Only"
          checked={filters.inStockOnly}
          onChange={() => onChange({ ...filters, inStockOnly: !filters.inStockOnly })}
        />
      </FilterSection>

      {/* Apply button */}
      <button
        style={{
          width: '100%',
          padding: '10px',
          borderRadius: '8px',
          backgroundColor: colors.primary,
          color: colors.white,
          fontSize: '13px',
          fontWeight: 700,
          border: 'none',
          cursor: 'pointer',
          transition: 'background-color 0.2s',
          marginTop: '4px',
        }}
        onMouseEnter={(e) =>
          ((e.currentTarget as HTMLButtonElement).style.backgroundColor = colors.primaryHover)
        }
        onMouseLeave={(e) =>
          ((e.currentTarget as HTMLButtonElement).style.backgroundColor = colors.primary)
        }
      >
        Apply Filters
      </button>
    </aside>
  );
};

export default FilterSidebar;
// export type { FilterState };
