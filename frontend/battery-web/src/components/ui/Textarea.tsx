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

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
  showCount?: boolean;
  className?: string;
}

const Textarea: React.FC<TextareaProps> = ({
  label,
  error,
  hint,
  showCount = false,
  className = "",
  id,
  value,
  maxLength,
  ...rest
}) => {
  const textareaId = id || label?.toLowerCase().replace(/\s+/g, "-");
  const currentLength = typeof value === "string" ? value.length : 0;

  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && (
        <div className="flex items-center justify-between">
          <label htmlFor={textareaId} className="text-sm font-medium" style={{ color: colors.secondary }}>
            {label}
            {rest.required && <span style={{ color: colors.primary }} className="ml-1">*</span>}
          </label>
          {showCount && maxLength && (
            <span className="text-xs" style={{ color: currentLength >= maxLength ? colors.error : colors.hint }}>
              {currentLength}/{maxLength}
            </span>
          )}
        </div>
      )}

      <textarea
        id={textareaId}
        value={value}
        maxLength={maxLength}
        style={{
          borderColor: error ? colors.error : colors.border,
          color: colors.secondary,
        }}
        className={`
          w-full rounded-md border bg-white
          text-sm px-4 py-2.5
          min-h-[120px] resize-y
          placeholder:text-gray-400
          transition-all duration-200
          focus:outline-none focus:ring-2
          disabled:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60
          ${className}
        `.trim()}
        {...rest}
      />

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

export default Textarea;

// --- USAGE ---
// <Textarea label="Message" placeholder="Type your message..." required />
// <Textarea label="Review" showCount maxLength={300} value={value} onChange={...} />. 