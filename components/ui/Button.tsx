import React from 'react';

// ============================================
// BRAND COLORS — change these to update theme
// ============================================
const colors = {
  primary: '#22C55E',
  primaryHover: '#16A34A',
  primaryActive: '#15803D',
  secondary: '#0D1B2A',
  secondaryHover: '#1E3448',
  white: '#FFFFFF',
};

type ButtonVariant = 'primary' | 'secondary' | 'outline';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
  className?: string;
  children: React.ReactNode;
}

const Spinner = () => (
  <svg
    className="animate-spin h-4 w-4"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
  >
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
  </svg>
);

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  isLoading = false,
  leftIcon,
  rightIcon,
  fullWidth = false,
  className = '',
  children,
  disabled,
  style,
  ...rest
}) => {
  const isDisabled = disabled || isLoading;

  const getStyles = (): React.CSSProperties => {
    switch (variant) {
      case 'primary':
        return {
          backgroundColor: colors.primary,
          color: colors.white,
          border: '2px solid transparent',
        };
      case 'secondary':
        return {
          backgroundColor: colors.secondary,
          color: colors.white,
          border: '2px solid transparent',
        };
      case 'outline':
        return {
          backgroundColor: 'transparent',
          color: colors.primary,
          border: `2px solid ${colors.primary}`,
        };
      default:
        return {};
    }
  };

  return (
    <button
      disabled={isDisabled}
      style={{ ...getStyles(), ...style }}
      className={`
        inline-flex items-center justify-center gap-2
        font-semibold text-sm tracking-wide
        rounded-md px-5 py-2.5
        transition-all duration-200 ease-in-out
        focus:outline-none focus:ring-2 focus:ring-offset-2
        disabled:opacity-50 disabled:cursor-not-allowed
        cursor-pointer
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `.trim()}
      {...rest}
    >
      {isLoading ? (
        <>
          <Spinner />
          <span>Loading...</span>
        </>
      ) : (
        <>
          {leftIcon && <span className="flex-shrink-0">{leftIcon}</span>}
          {children}
          {rightIcon && <span className="flex-shrink-0">{rightIcon}</span>}
        </>
      )}
    </button>
  );
};

export default Button;

// --- USAGE ---
// <Button variant="primary">Add to Cart</Button>
// <Button variant="secondary">Learn More</Button>
// <Button variant="outline">View Details</Button>
// <Button isLoading={true}>Submitting</Button>
// <Button variant="primary" fullWidth>Checkout</Button>.
