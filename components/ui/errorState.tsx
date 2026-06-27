import React from 'react';
import Button from './Button';

// ============================================
// BRAND COLORS — change these to update theme
// ============================================
const colors = {
  primary: '#22C55E',
  secondary: '#0D1B2A',
  error: '#EF4444',
  errorBg: '#FEF2F2',
  errorBorder: '#FECACA',
  textMuted: '#6B7280',
  white: '#FFFFFF',
};

type ErrorVariant = 'page' | 'inline' | 'card';

interface ErrorStateProps {
  variant?: ErrorVariant;
  title?: string;
  message?: string;
  onRetry?: () => void;
  retryLabel?: string;
  className?: string;
}

const ErrorIcon = ({ size = 48 }: { size?: number }) => (
  <svg width={size} height={size} fill="none" viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="10" stroke={colors.error} strokeWidth="1.5" />
    <path d="M12 8v4M12 16h.01" stroke={colors.error} strokeWidth="2" strokeLinecap="round" />
  </svg>
);

const ErrorState: React.FC<ErrorStateProps> = ({
  variant = 'page',
  title = 'Something went wrong',
  message = 'We encountered an error. Please try again.',
  onRetry,
  retryLabel = 'Try Again',
  className = '',
}) => {
  if (variant === 'inline') {
    return (
      <div
        className={`flex items-start gap-3 rounded-md px-4 py-3 ${className}`}
        style={{
          backgroundColor: colors.errorBg,
          border: `1px solid ${colors.errorBorder}`,
        }}
      >
        <ErrorIcon size={18} />
        <div className="flex flex-col gap-0.5 flex-1">
          <p className="text-sm font-semibold" style={{ color: colors.error }}>
            {title}
          </p>
          {message && (
            <p className="text-xs" style={{ color: colors.textMuted }}>
              {message}
            </p>
          )}
        </div>
        {onRetry && (
          <button
            onClick={onRetry}
            className="ml-auto text-xs font-semibold underline"
            style={{ color: colors.error }}
          >
            {retryLabel}
          </button>
        )}
      </div>
    );
  }

  if (variant === 'card') {
    return (
      <div
        className={`flex flex-col items-center justify-center gap-4 rounded-xl p-8 text-center ${className}`}
        style={{
          backgroundColor: colors.errorBg,
          border: `1px solid ${colors.errorBorder}`,
        }}
      >
        <ErrorIcon size={36} />
        <div className="flex flex-col gap-1">
          <p className="text-base font-bold" style={{ color: colors.secondary }}>
            {title}
          </p>
          <p className="text-sm" style={{ color: colors.textMuted }}>
            {message}
          </p>
        </div>
        {onRetry && (
          <Button onClick={onRetry} variant="primary">
            {retryLabel}
          </Button>
        )}
      </div>
    );
  }

  return (
    <div
      className={`flex flex-col items-center justify-center gap-6 min-h-[400px] text-center px-4 ${className}`}
    >
      <ErrorIcon size={64} />
      <div className="flex flex-col gap-2 max-w-sm">
        <h2 className="text-2xl font-bold" style={{ color: colors.secondary }}>
          {title}
        </h2>
        <p className="text-sm" style={{ color: colors.textMuted }}>
          {message}
        </p>
      </div>
      {onRetry && (
        <Button onClick={onRetry} variant="primary">
          {retryLabel}
        </Button>
      )}
    </div>
  );
};

export default ErrorState;
