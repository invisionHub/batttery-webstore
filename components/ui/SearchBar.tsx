'use client';

import React, { useState, useRef, useEffect } from 'react';

// ============================================
// BRAND COLORS — change these to update theme
// ============================================
const colors = {
  primary: '#22C55E',
  primaryHover: '#16A34A',
  secondary: '#0D1B2A',
  white: '#FFFFFF',
  border: '#E5E7EB',
  borderFocus: '#22C55E',
  bgLight: '#F9FAFB',
  textMuted: '#9CA3AF',
};

interface SearchBarProps {
  value?: string;
  onChange?: (value: string) => void;
  onSearch?: (value: string) => void;
  placeholder?: string;
  autoFocus?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({
  value = '',
  onChange,
  onSearch,
  placeholder = 'Search products...',
  autoFocus = false,
  size = 'md',
  className = '',
}) => {
  const [localValue, setLocalValue] = useState(value);
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // useEffect(() => {
  //   setLocalValue(value);
  // }, [value]);

  useEffect(() => {
    if (autoFocus) inputRef.current?.focus();
  }, [autoFocus]);

  const sizeStyles = {
    sm: { padding: '6px 12px', fontSize: '13px', iconSize: 14 },
    md: { padding: '10px 16px', fontSize: '14px', iconSize: 16 },
    lg: { padding: '13px 20px', fontSize: '15px', iconSize: 18 },
  }[size];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setLocalValue(val);
    onChange?.(val);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch?.(localValue);
  };

  const handleClear = () => {
    setLocalValue('');
    onChange?.('');
    onSearch?.('');
    inputRef.current?.focus();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={`flex items-center rounded-md overflow-hidden w-full transition-all duration-200 ${className}`}
      style={{
        border: `1.5px solid ${isFocused ? colors.borderFocus : colors.border}`,
        boxShadow: isFocused ? `0 0 0 3px rgba(34,197,94,0.12)` : 'none',
        backgroundColor: colors.white,
      }}
    >
      {/* Search icon */}
      <span className="flex-shrink-0 pl-3" style={{ color: colors.textMuted }}>
        <svg
          width={sizeStyles.iconSize}
          height={sizeStyles.iconSize}
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <circle cx="11" cy="11" r="8" />
          <path d="M21 21l-4.35-4.35" strokeLinecap="round" />
        </svg>
      </span>

      {/* Input */}
      <input
        ref={inputRef}
        type="text"
        value={localValue}
        onChange={handleChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder={placeholder}
        className="flex-1 bg-transparent focus:outline-none"
        style={{
          padding: sizeStyles.padding,
          fontSize: sizeStyles.fontSize,
          color: colors.secondary,
        }}
      />

      {/* Clear button */}
      {localValue && (
        <button
          type="button"
          onClick={handleClear}
          className="flex-shrink-0 pr-2 flex items-center justify-center"
          style={{ color: colors.textMuted }}
          aria-label="Clear search"
        >
          <svg
            width="14"
            height="14"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" />
          </svg>
        </button>
      )}

      {/* Search button */}
      <button
        type="submit"
        className="flex-shrink-0 flex items-center justify-center px-4 h-full transition-colors duration-200"
        style={{
          backgroundColor: colors.primary,
          minHeight: '40px',
        }}
        onMouseEnter={(e) =>
          ((e.currentTarget as HTMLElement).style.backgroundColor = colors.primaryHover)
        }
        onMouseLeave={(e) =>
          ((e.currentTarget as HTMLElement).style.backgroundColor = colors.primary)
        }
        aria-label="Search"
      >
        <svg
          width={sizeStyles.iconSize}
          height={sizeStyles.iconSize}
          fill="none"
          stroke={colors.white}
          strokeWidth="2.5"
          viewBox="0 0 24 24"
        >
          <circle cx="11" cy="11" r="8" />
          <path d="M21 21l-4.35-4.35" strokeLinecap="round" />
        </svg>
      </button>
    </form>
  );
};

export default SearchBar;

// --- USAGE ---
// Controlled:
// <SearchBar value={query} onChange={setQuery} onSearch={handleSearch} />
//
// Uncontrolled with size:
// <SearchBar size="lg" placeholder="Search all products..." onSearch={handleSearch} />
//
// With autoFocus:
// <SearchBar autoFocus onSearch={handleSearch} />
