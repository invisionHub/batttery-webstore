import React from 'react';

// ============================================
// BRAND COLORS — change these to update theme
// ============================================
const colors = {
  primary: '#22C55E',
  secondary: '#0D1B2A',
  white: '#FFFFFF',
};

type LoaderSize = 'sm' | 'md' | 'lg';
type LoaderVariant = 'spinner' | 'dots' | 'pulse';

interface LoaderProps {
  size?: LoaderSize;
  variant?: LoaderVariant;
  fullScreen?: boolean;
  label?: string;
  className?: string;
}

const sizeMap: Record<LoaderSize, string> = {
  sm: 'w-4 h-4',
  md: 'w-8 h-8',
  lg: 'w-12 h-12',
};

const dotSizeMap: Record<LoaderSize, string> = {
  sm: 'w-1.5 h-1.5',
  md: 'w-2.5 h-2.5',
  lg: 'w-3.5 h-3.5',
};

const Spinner = ({ size }: { size: LoaderSize }) => (
  <svg
    className={`animate-spin ${sizeMap[size]}`}
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
  >
    <circle
      className="opacity-20"
      cx="12"
      cy="12"
      r="10"
      stroke={colors.secondary}
      strokeWidth="4"
    />
    <path fill={colors.primary} d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
  </svg>
);

const Dots = ({ size }: { size: LoaderSize }) => (
  <div className="flex items-center gap-1.5">
    {[0, 1, 2].map((i) => (
      <div
        key={i}
        className={`rounded-full ${dotSizeMap[size]}`}
        style={{
          backgroundColor: colors.primary,
          animation: 'javal-bounce 0.8s ease-in-out infinite',
          animationDelay: `${i * 0.15}s`,
        }}
      />
    ))}
    <style>{`
      @keyframes javal-bounce {
        0%, 80%, 100% { transform: scale(0.6); opacity: 0.4; }
        40% { transform: scale(1); opacity: 1; }
      }
    `}</style>
  </div>
);

const Pulse = ({ size }: { size: LoaderSize }) => (
  <div
    className={`rounded-full animate-pulse ${sizeMap[size]}`}
    style={{ backgroundColor: colors.primary, opacity: 0.7 }}
  />
);

const Loader: React.FC<LoaderProps> = ({
  size = 'md',
  variant = 'spinner',
  fullScreen = false,
  label,
  className = '',
}) => {
  const content = (
    <div className={`flex flex-col items-center justify-center gap-3 ${className}`}>
      {variant === 'spinner' && <Spinner size={size} />}
      {variant === 'dots' && <Dots size={size} />}
      {variant === 'pulse' && <Pulse size={size} />}
      {label && (
        <p className="text-sm font-medium" style={{ color: colors.secondary }}>
          {label}
        </p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center"
        style={{ backgroundColor: 'rgba(255,255,255,0.85)' }}
      >
        {content}
      </div>
    );
  }

  return content;
};

export default Loader;
