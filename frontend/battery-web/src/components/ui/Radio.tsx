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

interface RadioOption {
  label: string;
  value: string;
  description?: string;
  disabled?: boolean;
}

interface RadioGroupProps {
  label?: string;
  name: string;
  options: RadioOption[];
  value?: string;
  onChange?: (value: string) => void;
  error?: string;
  hint?: string;
  direction?: "vertical" | "horizontal";
  className?: string;
}

const RadioGroup: React.FC<RadioGroupProps> = ({
  label,
  name,
  options,
  value,
  onChange,
  error,
  hint,
  direction = "vertical",
  className = "",
}) => {
  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      {label && (
        <span className="text-sm font-medium" style={{ color: colors.secondary }}>
          {label}
        </span>
      )}

      <div className={`flex gap-3 ${direction === "horizontal" ? "flex-row flex-wrap" : "flex-col"}`}>
        {options.map((option) => {
          const isSelected = value === option.value;
          return (
            <label
              key={option.value}
              className={`flex items-start gap-3 cursor-pointer ${option.disabled ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              <input
                type="radio"
                name={name}
                value={option.value}
                checked={isSelected}
                disabled={option.disabled}
                onChange={() => onChange?.(option.value)}
                className="sr-only"
              />
              <div
                style={{
                  width: "20px",
                  height: "20px",
                  borderRadius: "50%",
                  border: `2px solid ${error ? colors.error : isSelected ? colors.primary : colors.border}`,
                  backgroundColor: colors.white,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  marginTop: "2px",
                  transition: "all 0.15s ease",
                }}
              >
                <div
                  style={{
                    width: "10px",
                    height: "10px",
                    borderRadius: "50%",
                    backgroundColor: colors.primary,
                    transform: isSelected ? "scale(1)" : "scale(0)",
                    transition: "transform 0.15s ease",
                  }}
                />
              </div>

              <div className="flex flex-col">
                <span className="text-sm font-medium select-none" style={{ color: colors.secondary }}>
                  {option.label}
                </span>
                {option.description && (
                  <span className="text-xs select-none" style={{ color: colors.hint }}>
                    {option.description}
                  </span>
                )}
              </div>
            </label>
          );
        })}
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

export default RadioGroup;

// --- USAGE ---
// const [selected, setSelected] = useState("")
// const options = [
//   { label: "Standard Delivery", value: "standard", description: "3-5 business days" },
//   { label: "Express Delivery", value: "express", description: "Next business day" },
// ]
// <RadioGroup label="Delivery" name="delivery" options={options} value={selected} onChange={setSelected} />. 