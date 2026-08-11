"use client"

const colors = {
  primary: '#CC0000',
  secondary: '#0D1B2A',
  white: '#FFFFFF',
  border: '#E5E7EB',
  bgLight: '#F9FAFB',
  textMuted: '#6B7280',
  error: '#EF4444',
  errorBg: '#FEF2F2',
  errorBorder: '#FECACA',
};

interface CatalogProps { 
    categoryOptions:{
    id: string;
    name: string;
    value: string;
    count: number;
    }[]
    selected:string[]
}
export function Catalog ({ ...catalogProps }: CatalogProps) {
    const {categoryOptions, selected} = catalogProps


     
    return (
          <div
          style={{
            display: 'flex',
            gap: '8px',
            overflowX: 'auto',
            paddingBottom: '4px',
            marginBottom: '20px',
          }}
        >
          <button
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
            }}
          >
            All
          </button>
          {categoryOptions.map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                if (selected.includes(cat.value)) {
                } else {
                }
              }}
              style={{
                flexShrink: 0,
                padding: '6px 16px',
                borderRadius: '999px',
                fontSize: '12px',
                fontWeight: 600,
                cursor: 'pointer',
                border: 'none',
                backgroundColor: selected.includes(cat.value)
                  ? colors.primary
                  : colors.white,
                color: selected.includes(cat.value) ? colors.white : colors.textMuted,
                outline: selected.includes(cat.value)
                  ? 'none'
                  : `1px solid ${colors.border}`,
              }}
            >
              {cat.name}
            </button>
          ))}
        </div>
    )
}