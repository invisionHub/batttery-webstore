'use client';

import React from 'react';

const colors = {
  primary: '#22C55E',
  primaryHover: '#16A34A',
  secondary: '#0D1B2A',
  white: '#FFFFFF',
  border: '#E5E7EB',
  textMuted: '#6B7280',
};

interface PaymentButtonProps {
  isLoading: boolean;
  isDisabled: boolean;
  total: number;
  paymentMethod: string;
  onSubmit: () => void;
}

const formatPrice = (n: number) => `₦${n.toLocaleString('en-NG')}`;

const PaymentButton: React.FC<PaymentButtonProps> = ({
  isLoading,
  isDisabled,
  total,
  paymentMethod,
  onSubmit,
}) => {
  const labels: Record<string, string> = {
    paystack: 'Pay with Paystack',
    transfer: 'Place Order — Pay via Transfer',
    card: 'Pay with Card',
  };

  const label = labels[paymentMethod] ?? 'Place Order';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <button
        onClick={onSubmit}
        disabled={isDisabled || isLoading}
        style={{
          width: '100%',
          padding: '15px',
          borderRadius: '10px',
          border: 'none',
          backgroundColor: isDisabled || isLoading ? '#9CA3AF' : colors.primary,
          color: colors.white,
          fontSize: '15px',
          fontWeight: 800,
          cursor: isDisabled || isLoading ? 'not-allowed' : 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '10px',
          transition: 'background-color 0.2s',
        }}
        onMouseEnter={(e) => {
          if (!isDisabled && !isLoading)
            (e.currentTarget as HTMLButtonElement).style.backgroundColor = colors.primaryHover;
        }}
        onMouseLeave={(e) => {
          if (!isDisabled && !isLoading)
            (e.currentTarget as HTMLButtonElement).style.backgroundColor = colors.primary;
        }}
      >
        {isLoading ? (
          <>
            <svg className="animate-spin" width="18" height="18" fill="none" viewBox="0 0 24 24">
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="white"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="white"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              />
            </svg>
            Processing...
          </>
        ) : (
          <>
            <svg
              width="18"
              height="18"
              fill="none"
              stroke="white"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <rect
                x="1"
                y="4"
                width="22"
                height="16"
                rx="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <line x1="1" y1="10" x2="23" y2="10" strokeLinecap="round" />
            </svg>
            {label} — {formatPrice(total)}
          </>
        )}
      </button>

      {/* Trust indicators */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px' }}>
        {['🔒 Secure', '✓ Encrypted', '🛡️ Protected'].map((item) => (
          <span key={item} style={{ fontSize: '11px', color: colors.textMuted }}>
            {item}
          </span>
        ))}
      </div>

      <p
        style={{
          fontSize: '11px',
          color: colors.textMuted,
          textAlign: 'center',
          margin: 0,
          lineHeight: 1.6,
        }}
      >
        By placing your order, you agree to JavaL's{' '}
        <a href="/terms" style={{ color: colors.primary, textDecoration: 'none' }}>
          Terms of Service
        </a>{' '}
        and{' '}
        <a href="/privacy" style={{ color: colors.primary, textDecoration: 'none' }}>
          Privacy Policy
        </a>
        .
      </p>
    </div>
  );
};

export default PaymentButton;
