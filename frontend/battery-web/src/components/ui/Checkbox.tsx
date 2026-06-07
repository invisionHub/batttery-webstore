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
  white: "#FFFFFF",
};

interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  description?: string;
  error?: string;
  checked?: boolean;
  className?: string;
}

const Checkbox: React.FC<CheckboxProps> = ({
  label,
  description,
  error,
  checked = false,
  className = "",
  id,
  ...rest
}) => {
  const checkboxId = id || label?.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      <label htmlFor={checkboxId} className="flex items-start gap-3 cursor-pointer">
        <div className="relative flex-shrink-0 mt-0.5">
          <input
            type="checkbox"
            id={checkboxId}
            checked={checked}
            className="sr-only"
            {...rest}
          />
          <div
            style={{
              width: "20px",
              height: "20px",
              borderRadius: "4px",
              border: `2px solid ${error ? colors.error : checked ? colors.primary : colors.border}`,
              backgroundColor: checked ? colors.primary : colors.white,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "all 0.15s ease",
              flexShrink: 0,
            }}
          >
            {checked && (
              <svg width="12" height="12" fill="none" stroke={colors.white} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            )}
          </div>
        </div>

        <div className="flex flex-col">
          {label && (
            <span className="text-sm font-medium select-none" style={{ color: colors.secondary }}>
              {label}
            </span>
          )}
          {description && (
            <span className="text-xs select-none" style={{ color: colors.hint }}>
              {description}
            </span>
          )}
        </div>
      </label>

      {error && (
        <p className="text-xs flex items-center gap-1 ml-8" style={{ color: colors.error }}>
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {error}
        </p>
      )}
    </div>
  );
};

export default Checkbox;

// --- USAGE ---
// const [checked, setChecked] = useState(false)
// <Checkbox label="I agree to terms" checked={checked} onChange={() => setChecked(!checked)} />
// <Checkbox label="Save address" description="For faster checkout" checked={checked} onChange={...} />. 