import { ProductCardSkeleton } from "@/components/ui"


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

export const GridListArrangement = ({ view, setView }: { view: "grid" | "list",  setView:(v:"grid" | "list")=>void} ) => {
  return (
          <div
            className="hidden sm:flex"
            style={{
            border: `1px solid ${colors.border}`,
            borderRadius: '8px',
            overflow: 'hidden',
                }}
            >
            {(['grid', 'list'] as const).map((v) => (
            <button
                key={v}
                onClick={() => setView(v)}
                aria-label={`${v} view`}
                style={{
                width: '34px',
                height: '34px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: view === v ? colors.primary : colors.white,
                color: view === v ? colors.white : colors.textMuted,
                border: 'none',
                cursor: 'pointer',
                }}
            >
                {v === 'grid' ? (
                <svg
                    width="14"
                    height="14"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                >
                    <rect x="3" y="3" width="7" height="7" />
                    <rect x="14" y="3" width="7" height="7" />
                    <rect x="3" y="14" width="7" height="7" />
                    <rect x="14" y="14" width="7" height="7" />
                </svg>
                ) : (
                <svg
                    width="14"
                    height="14"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                >
                    <line x1="3" y1="6" x2="21" y2="6" />
                    <line x1="3" y1="12" x2="21" y2="12" />
                    <line x1="3" y1="18" x2="21" y2="18" />
                </svg>
                )}
            </button>
            ))}
        </div>

  )
}

interface IProductSkeletonProps {
    loading: boolean
}

export const ProductSkeleton = ({loading}:IProductSkeletonProps) => {
    loading &&
        (
            <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
                  gap: '16px',
                }}
              >
                {Array.from({ length: 12 }).map((_, i) => (
                  <ProductCardSkeleton key={i} />
                ))}
              </div>
        ) 
}





export const ProductNotFound = ({error}:{error:any}) => {
    return (
         <div
            style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: '64px 24px',
            textAlign: 'center',
            backgroundColor: colors.white,
            borderRadius: '12px',
            border: `1px dashed ${colors.border}`,
            }}
        >
            <h3
                style={{
                fontSize: '16px',
                fontWeight: 700,
                color: colors.secondary,
                margin: '0 0 8px 0',
                }}
            >
                {error}
             </h3>
            <p style={{ fontSize: '13px', color: colors.textMuted, margin: 0 }}>
                Try adjusting your filters or search term
            </p>
        </div>
    )
}