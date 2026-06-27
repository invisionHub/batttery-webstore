import React from 'react';

// ============================================
// BRAND COLORS — change these to update theme
// ============================================
const colors = {
  primary: '#22C55E',
  secondary: '#0D1B2A',
  error: '#EF4444',
  border: '#D1D5DB',
  placeholder: '#9CA3AF',
  hint: '#9CA3AF',
};

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  className?: string;
}

const Input: React.FC<InputProps> = ({
  label,
  error,
  hint,
  leftIcon,
  rightIcon,
  className = '',
  id,
  ...rest
}) => {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && (
        <label
          htmlFor={inputId}
          className="text-sm font-medium"
          style={{ color: colors.secondary }}
        >
          {label}
          {rest.required && (
            <span style={{ color: colors.primary }} className="ml-1">
              *
            </span>
          )}
        </label>
      )}

      <div className="relative flex items-center">
        {leftIcon && (
          <span className="absolute left-3 flex-shrink-0" style={{ color: colors.placeholder }}>
            {leftIcon}
          </span>
        )}

        <input
          id={inputId}
          style={{
            borderColor: error ? colors.error : colors.border,
            color: colors.secondary,
          }}
          className={`
            w-full rounded-md border bg-white text-sm
            px-4 py-2.5
            transition-all duration-200
            focus:outline-none focus:ring-2 focus:ring-offset-0
            disabled:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60
            placeholder:text-gray-400
            ${leftIcon ? 'pl-10' : ''}
            ${rightIcon ? 'pr-10' : ''}
            ${className}
          `.trim()}
          {...rest}
        />

        {rightIcon && (
          <span className="absolute right-3 flex-shrink-0" style={{ color: colors.placeholder }}>
            {rightIcon}
          </span>
        )}
      </div>

      {error && (
        <p className="text-xs flex items-center gap-1" style={{ color: colors.error }}>
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
          {error}
        </p>
      )}

      {hint && !error && (
        <p className="text-xs" style={{ color: colors.hint }}>
          {hint}
        </p>
      )}
    </div>
  );
};

export default Input;

// --- USAGE ---
// <Input label="Email" type="email" placeholder="you@example.com" required />
// <Input label="Password" type="password" error="Password is required" />
// <Input label="Search" leftIcon={<SearchIcon />} />
// <Input label="Phone" hint="Include country code e.g +234" />.
