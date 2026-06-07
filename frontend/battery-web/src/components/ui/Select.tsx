import React from "react";

// ============================================
// BRAND COLORS — change these to update theme
// ============================================
const colors = {
  primary: "#22C55E",
  secondary: "#0D1B2A",
  error: "#EF4444",
  border: "#D1D5DB",
  hint: "#9CA3AF",
};

interface SelectOption {
  label: string;
  value: string;
  disabled?: boolean;
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: SelectOption[];
  placeholder?: string;
  error?: string;
  hint?: string;
  className?: string;
}

const Select: React.FC<SelectProps> = ({
  label,
  options,
  placeholder = "Select an option",
  error,
  hint,
  className = "",
  id,
  ...rest
}) => {
  const selectId = id || label?.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && (
        <label htmlFor={selectId} className="text-sm font-medium" style={{ color: colors.secondary }}>
          {label}
          {rest.required && <span style={{ color: colors.primary }} className="ml-1">*</span>}
        </label>
      )}

      <div className="relative">
        <select
          id={selectId}
          style={{
            borderColor: error ? colors.error : colors.border,
            color: colors.secondary,
          }}
          className={`
            w-full appearance-none rounded-md border bg-white
            text-sm px-4 py-2.5 pr-10
            transition-all duration-200
            focus:outline-none focus:ring-2
            disabled:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60
            cursor-pointer
            ${className}
          `.trim()}
          {...rest}
        >
          <option value="" disabled>{placeholder}</option>
          {options.map((option) => (
            <option key={option.value} value={option.value} disabled={option.disabled}>
              {option.label}
            </option>
          ))}
        </select>

        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2" style={{ color: colors.hint }}>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </span>
      </div>

      {error && (
        <p className="text-xs flex items-center gap-1" style={{ color: colors.error }}>
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {error}
        </p>
      )}

      {hint && !error && (
        <p className="text-xs" style={{ color: colors.hint }}>{hint}</p>
      )}
    </div>
  );
};

export default Select;

// --- USAGE ---
// const options = [
//   { label: "Solar Panels", value: "solar" },
//   { label: "Batteries", value: "batteries" },
// ]
// <Select label="Category" options={options} required />
// <Select label="Sort By" options={options} error="Please select" />. 