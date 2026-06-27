import React from 'react';
import Button from './Button';

// ============================================
// BRAND COLORS — change these to update theme
// ============================================
const colors = {
  primary: '#22C55E',
  secondary: '#0D1B2A',
  textMuted: '#6B7280',
  border: '#E5E7EB',
  bgLight: '#F9FAFB',
  white: '#FFFFFF',
};

type EmptyVariant = 'cart' | 'search' | 'products' | 'orders' | 'generic';

interface EmptyStateProps {
  variant?: EmptyVariant;
  title?: string;
  message?: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

const icons: Record<EmptyVariant, React.ReactNode> = {
  cart: (
    <svg width="64" height="64" fill="none" viewBox="0 0 24 24">
      <path
        d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"
        stroke={colors.border}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <line
        x1="3"
        y1="6"
        x2="21"
        y2="6"
        stroke={colors.border}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M16 10a4 4 0 01-8 0"
        stroke={colors.primary}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  search: (
    <svg width="64" height="64" fill="none" viewBox="0 0 24 24">
      <circle cx="11" cy="11" r="8" stroke={colors.border} strokeWidth="1.5" />
      <path d="M21 21l-4.35-4.35" stroke={colors.border} strokeWidth="1.5" strokeLinecap="round" />
      <path d="M8 11h6M11 8v6" stroke={colors.primary} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),
  products: (
    <svg width="64" height="64" fill="none" viewBox="0 0 24 24">
      <rect x="2" y="3" width="20" height="14" rx="2" stroke={colors.border} strokeWidth="1.5" />
      <path d="M8 21h8M12 17v4" stroke={colors.border} strokeWidth="1.5" strokeLinecap="round" />
      <path
        d="M9 10l2 2 4-4"
        stroke={colors.primary}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  orders: (
    <svg width="64" height="64" fill="none" viewBox="0 0 24 24">
      <path
        d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"
        stroke={colors.border}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M14 2v6h6"
        stroke={colors.border}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M9 13h6M9 17h4" stroke={colors.primary} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),
  generic: (
    <svg width="64" height="64" fill="none" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="10" stroke={colors.border} strokeWidth="1.5" />
      <path d="M12 8v4M12 16h.01" stroke={colors.primary} strokeWidth="2" strokeLinecap="round" />
    </svg>
  ),
};

const defaults: Record<EmptyVariant, { title: string; message: string }> = {
  cart: {
    title: 'Your cart is empty',
    message: "Looks like you haven't added anything yet. Start shopping!",
  },
  search: {
    title: 'No results found',
    message: 'Try different keywords or browse our categories.',
  },
  products: {
    title: 'No products available',
    message: 'Check back later or explore other categories.',
  },
  orders: { title: 'No orders yet', message: 'When you place an order, it will show up here.' },
  generic: { title: 'Nothing here yet', message: "There's nothing to show right now." },
};

const EmptyState: React.FC<EmptyStateProps> = ({
  variant = 'generic',
  title,
  message,
  actionLabel,
  onAction,
  className = '',
}) => {
  const def = defaults[variant];

  return (
    <div
      className={`flex flex-col items-center justify-center gap-5 py-16 px-6 text-center rounded-xl ${className}`}
      style={{ backgroundColor: colors.bgLight, border: `1px dashed ${colors.border}` }}
    >
      <div style={{ opacity: 0.7 }}>{icons[variant]}</div>
      <div className="flex flex-col gap-1.5 max-w-xs">
        <h3 className="text-lg font-bold" style={{ color: colors.secondary }}>
          {title || def.title}
        </h3>
        <p className="text-sm" style={{ color: colors.textMuted }}>
          {message || def.message}
        </p>
      </div>
      {onAction && actionLabel && (
        <Button onClick={onAction} variant="primary" className="mt-1">
          {actionLabel}
        </Button>
      )}
    </div>
  );
};

export default EmptyState;
