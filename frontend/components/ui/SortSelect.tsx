'use client';

import React from 'react';

const colors = {
  primary: '#22C55E',
  secondary: '#0D1B2A',
  white: '#FFFFFF',
  border: '#E5E7EB',
  textMuted: '#6B7280',
};

export const SORT_OPTIONS = [
  { label: 'Most Popular', value: 'popular' },
  { label: 'Newest First', value: 'newest' },
  { label: 'Price: Low to High', value: 'price-asc' },
  { label: 'Price: High to Low', value: 'price-desc' },
  { label: 'Top Rated', value: 'rating' },
  { label: 'Name: A to Z', value: 'name-asc' },
];

interface SortSelectProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

const SortSelect: React.FC<SortSelectProps> = ({ value, onChange, className = '' }) => {
  return (
    <div className={className} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <label
        style={{
          fontSize: '12px',
          fontWeight: 600,
          color: colors.textMuted,
          whiteSpace: 'nowrap',
          flexShrink: 0,
        }}
      >
        Sort by:
      </label>
      <div style={{ position: 'relative' }}>
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          style={{
            appearance: 'none',
            padding: '7px 32px 7px 12px',
            fontSize: '13px',
            fontWeight: 500,
            color: colors.secondary,
            backgroundColor: colors.white,
            border: `1px solid ${colors.border}`,
            borderRadius: '8px',
            cursor: 'pointer',
            outline: 'none',
            minWidth: '160px',
          }}
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <span
          style={{
            position: 'absolute',
            right: '10px',
            top: '50%',
            transform: 'translateY(-50%)',
            pointerEvents: 'none',
            color: colors.textMuted,
          }}
        >
          <svg
            width="12"
            height="12"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            viewBox="0 0 24 24"
          >
            <path d="M19 9l-7 7-7-7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </div>
    </div>
  );
};

export default SortSelect;
