import React, { useEffect, useState } from 'react';
import Button from './Button';

// ============================================
// BRAND COLORS — change these to update theme
// ============================================
const colors = {
  primary: '#22C55E',
  secondary: '#0D1B2A',
  successBg: '#F0FDF4',
  successBorder: '#BBF7D0',
  textMuted: '#6B7280',
  white: '#FFFFFF',
};

type SuccessVariant = 'toast' | 'inline' | 'page';

interface SuccessMessageProps {
  variant?: SuccessVariant;
  title?: string;
  message?: string;
  autoDismiss?: boolean;
  dismissAfter?: number;
  onDismiss?: () => void;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

const SuccessIcon = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} fill="none" viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="10" fill={colors.primary} />
    <path
      d="M8 12l3 3 5-5"
      stroke={colors.white}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const SuccessMessage: React.FC<SuccessMessageProps> = ({
  variant = 'inline',
  title = 'Success!',
  message,
  autoDismiss = false,
  dismissAfter = 3000,
  onDismiss,
  actionLabel,
  onAction,
  className = '',
}) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (autoDismiss) {
      const timer = setTimeout(() => {
        setVisible(false);
        onDismiss?.();
      }, dismissAfter);
      return () => clearTimeout(timer);
    }
  }, [autoDismiss, dismissAfter, onDismiss]);

  if (!visible) return null;

  if (variant === 'toast') {
    return (
      <div
        className={`fixed bottom-6 right-6 z-50 flex items-start gap-3 rounded-xl px-5 py-4 shadow-lg max-w-sm ${className}`}
        style={{
          backgroundColor: colors.white,
          border: `1px solid ${colors.successBorder}`,
          animation: 'javal-slide-in 0.3s ease',
        }}
      >
        <style>{`
          @keyframes javal-slide-in {
            from { transform: translateY(20px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
          }
        `}</style>
        <SuccessIcon size={22} />
        <div className="flex flex-col gap-0.5 flex-1">
          <p className="text-sm font-bold" style={{ color: colors.secondary }}>
            {title}
          </p>
          {message && (
            <p className="text-xs" style={{ color: colors.textMuted }}>
              {message}
            </p>
          )}
        </div>
        {onDismiss && (
          <button
            onClick={() => {
              setVisible(false);
              onDismiss();
            }}
            style={{ color: colors.textMuted }}
            aria-label="Dismiss"
            className="p-1 hover:opacity-70 transition-opacity"
          >
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
              <path
                d="M18 6L6 18M6 6l12 12"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>
        )}
      </div>
    );
  }

  if (variant === 'inline') {
    return (
      <div
        className={`flex items-start gap-3 rounded-md px-4 py-3 ${className}`}
        style={{
          backgroundColor: colors.successBg,
          border: `1px solid ${colors.successBorder}`,
        }}
      >
        <SuccessIcon size={18} />
        <div className="flex flex-col gap-0.5 flex-1">
          <p className="text-sm font-semibold" style={{ color: colors.secondary }}>
            {title}
          </p>
          {message && (
            <p className="text-xs" style={{ color: colors.textMuted }}>
              {message}
            </p>
          )}
        </div>
        {onAction && actionLabel && (
          <button
            onClick={onAction}
            className="text-xs font-semibold underline ml-auto"
            style={{ color: colors.primary }}
          >
            {actionLabel}
          </button>
        )}
      </div>
    );
  }

  return (
    <div
      className={`flex flex-col items-center justify-center gap-6 min-h-[400px] text-center px-4 ${className}`}
    >
      <div
        className="w-20 h-20 rounded-full flex items-center justify-center"
        style={{ backgroundColor: colors.successBg, border: `2px solid ${colors.successBorder}` }}
      >
        <SuccessIcon size={40} />
      </div>
      <div className="flex flex-col gap-2 max-w-sm">
        <h2 className="text-2xl font-bold" style={{ color: colors.secondary }}>
          {title}
        </h2>
        {message && (
          <p className="text-sm" style={{ color: colors.textMuted }}>
            {message}
          </p>
        )}
      </div>
      {onAction && actionLabel && (
        <Button onClick={onAction} variant="primary">
          {actionLabel}
        </Button>
      )}
    </div>
  );
};

export default SuccessMessage;
