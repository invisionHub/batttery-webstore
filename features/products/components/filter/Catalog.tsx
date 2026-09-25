'use client';

const colors = {
  primary: '#CC0000',
  secondary: '#0D1B2A',
  white: '#FFFFFF',
  border: '#E5E7EB',
  bgLight: '#F9FAFB',
  textMuted: '#6B7280',
};

interface CatalogProps {
  categoryOptions: {
    id: string;
    name: string;
    value: string;
    count: number;
  }[];
  selected: string[];
  onSelectCategory?: (categoryValue: string | null) => void;
}

export function Catalog({ categoryOptions, selected, onSelectCategory }: CatalogProps) {
  return (
    <div
      style={{
        display: 'flex',
        gap: '8px',
        overflowX: 'auto',
        paddingBottom: '4px',
        marginBottom: '20px',
        scrollbarWidth: 'thin',
      }}
    >
      <button
        onClick={() => onSelectCategory?.(null)}
        style={{
          flexShrink: 0,
          padding: '6px 16px',
          borderRadius: '999px',
          fontSize: '12px',
          fontWeight: 600,
          cursor: 'pointer',
          border: 'none',
          backgroundColor: selected.length === 0 ? colors.primary : colors.white,
          color: selected.length === 0 ? colors.white : colors.textMuted,
          outline: selected.length === 0 ? 'none' : `1px solid ${colors.border}`,
          transition: 'all 0.15s ease',
        }}
      >
        All Products
      </button>
      {categoryOptions.map((cat) => {
        const isSelected = selected.includes(cat.value);
        return (
          <button
            key={cat.id}
            onClick={() => onSelectCategory?.(cat.value)}
            style={{
              flexShrink: 0,
              padding: '6px 16px',
              borderRadius: '999px',
              fontSize: '12px',
              fontWeight: 600,
              cursor: 'pointer',
              border: 'none',
              backgroundColor: isSelected ? colors.primary : colors.white,
              color: isSelected ? colors.white : colors.textMuted,
              outline: isSelected ? 'none' : `1px solid ${colors.border}`,
              transition: 'all 0.15s ease',
            }}
          >
            {cat.name} {cat.count > 0 ? `(${cat.count})` : ''}
          </button>
        );
      })}
    </div>
  );
}