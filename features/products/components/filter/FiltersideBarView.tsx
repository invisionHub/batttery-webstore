import { FilterSidebar } from "@/components/product";

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


interface FilterSideBarViewProps {
    setMobileFiltersOpen: (value: boolean) => void
    activeFilterCount:number
}
export function FilterSidebarView ({ ...filterSideViewProps }: FilterSideBarViewProps) {
    
    const {activeFilterCount, setMobileFiltersOpen} = filterSideViewProps
    return (
        <div>
            <button
                onClick={() => setMobileFiltersOpen(true)}
                className="lg:hidden"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '13px',
                  fontWeight: 600,
                  color: colors.secondary,
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: 0,
                }}
              >
                <svg
                  width="16"
                  height="16"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <line x1="4" y1="6" x2="20" y2="6" />
                  <line x1="4" y1="12" x2="20" y2="12" />
                  <line x1="4" y1="18" x2="20" y2="18" />
                </svg>
                Filters
                {activeFilterCount > 0 && (
                  <span
                    style={{
                      width: '18px',
                      height: '18px',
                      borderRadius: '50%',
                      backgroundColor: colors.primary,
                      color: colors.white,
                      fontSize: '10px',
                      fontWeight: 700,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {activeFilterCount}
                  </span>
                )} 
              </button>
              {/* <span
                className="hidden lg:block"
                style={{ fontSize: '12px', color: colors.textMuted }}
              >
                {/* {loading
                  ? 'Loading...'
                  : `Showing ${paginatedProducts.length} of ${filteredProducts.length}`}
              </span> */} 
    </div>
    )
}