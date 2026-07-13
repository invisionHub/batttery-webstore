'use client';

import React from 'react';

// ============================================
// BRAND COLORS — change these to update theme
// ============================================
const colors = {
  primary: '#CC0000',
  secondary: '#0D1B2A',
  white: '#FFFFFF',
  border: '#E5E7EB',
  textMuted: '#6B7280',
  bgLight: '#F9FAFB',
};

interface QuantitySelectorProps {
  value: number;
  min?: number;
  max?: number;
  onChange: (value: number) => void;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizes = {
  sm: { btn: '28px', input: '28px', fontSize: '12px' },
  md: { btn: '36px', input: '40px', fontSize: '13px' },
  lg: { btn: '42px', input: '48px', fontSize: '14px' },
};

const QuantitySelector: React.FC<QuantitySelectorProps> = ({
  value,
  min = 1,
  max = 99,
  onChange,
  size = 'md',
  className = '',
}) => {
  const s = sizes[size];
  const canDecrease = value > min;
  const canIncrease = value < max;

  return (
    <div
      className={className}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        border: `1.5px solid ${colors.border}`,
        borderRadius: '8px',
        overflow: 'hidden',
        backgroundColor: colors.white,
      }}
    >
      {/* Decrease */}
      <button
        onClick={() => canDecrease && onChange(value - 1)}
        disabled={!canDecrease}
        aria-label="Decrease quantity"
        style={{
          width: s.btn,
          height: s.btn,
          border: 'none',
          borderRight: `1px solid ${colors.border}`,
          backgroundColor: canDecrease ? colors.white : colors.bgLight,
          color: canDecrease ? colors.secondary : colors.textMuted,
          fontSize: '16px',
          fontWeight: 700,
          cursor: canDecrease ? 'pointer' : 'not-allowed',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          transition: 'background-color 0.15s',
        }}
        onMouseEnter={(e) => {
          if (canDecrease)
            (e.currentTarget as HTMLButtonElement).style.backgroundColor = colors.bgLight;
        }}
        onMouseLeave={(e) => {
          if (canDecrease)
            (e.currentTarget as HTMLButtonElement).style.backgroundColor = colors.white;
        }}
      >
        −
      </button>

      {/* Value display */}
      <span
        style={{
          width: s.input,
          height: s.btn,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: s.fontSize,
          fontWeight: 700,
          color: colors.secondary,
          userSelect: 'none',
        }}
      >
        {value}
      </span>

      {/* Increase */}
      <button
        onClick={() => canIncrease && onChange(value + 1)}
        disabled={!canIncrease}
        aria-label="Increase quantity"
        style={{
          width: s.btn,
          height: s.btn,
          border: 'none',
          borderLeft: `1px solid ${colors.border}`,
          backgroundColor: canIncrease ? colors.white : colors.bgLight,
          color: canIncrease ? colors.secondary : colors.textMuted,
          fontSize: '16px',
          fontWeight: 700,
          cursor: canIncrease ? 'pointer' : 'not-allowed',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          transition: 'background-color 0.15s',
        }}
        onMouseEnter={(e) => {
          if (canIncrease)
            (e.currentTarget as HTMLButtonElement).style.backgroundColor = colors.bgLight;
        }}
        onMouseLeave={(e) => {
          if (canIncrease)
            (e.currentTarget as HTMLButtonElement).style.backgroundColor = colors.white;
        }}
      >
        +
      </button>
    </div>
  );
};

export default QuantitySelector;

// --- USAGE ---
// <QuantitySelector value={qty} onChange={setQty} />
// <QuantitySelector value={qty} min={1} max={10} onChange={setQty} size="lg" />
