import Link from 'next/link';

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

interface IProductHeaderProps {
  search: string;
  setSearch: (param: string) => void;
  resultCount: number;
  onSearchSubmit?: () => void;
}

export function ProductHeader({
  resultCount,
  search,
  setSearch,
  onSearchSubmit,
}: IProductHeaderProps) {
  return (
    <div
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
      style={{ paddingTop: '20px', paddingBottom: '24px' }}
    >
      <nav
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          fontSize: '12px',
          color: colors.textMuted,
          marginBottom: '16px',
        }}
      >
        <Link href="/" style={{ color: colors.textMuted, textDecoration: 'none' }}>
          Home
        </Link>
        <span>/</span>
        <span style={{ color: colors.secondary, fontWeight: 600 }}>All Products</span>
      </nav>

      <div
        className="flex flex-col sm:flex-row sm:items-end justify-between gap-4"
        style={{ marginBottom: '16px' }}
      >
        <div>
          <h1 style={{ fontSize: '26px', fontWeight: 900, color: colors.secondary, margin: 0 }}>
            Electrical & Lighting Catalog
          </h1>
          <p style={{ fontSize: '13px', color: colors.textMuted, margin: '4px 0 0 0' }}>
            Showing {resultCount} {resultCount === 1 ? 'product' : 'products'}
          </p>
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSearchSubmit?.();
          }}
          className="flex items-center rounded-lg overflow-hidden w-full sm:w-[320px] shadow-sm"
          style={{
            border: `1.5px solid ${colors.border}`,
            backgroundColor: colors.white,
          }}
        >
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
            }}
            placeholder="Search products, brands, SKUs..."
            style={{
              flex: 1,
              padding: '9px 14px',
              fontSize: '13px',
              color: colors.secondary,
              border: 'none',
              outline: 'none',
              backgroundColor: 'transparent',
            }}
          />
          {search && (
            <button
              type="button"
              onClick={() => {
                setSearch('');
                onSearchSubmit?.();
              }}
              aria-label="Clear search"
              style={{
                padding: '0 8px',
                color: colors.textMuted,
                background: 'none',
                border: 'none',
                cursor: 'pointer',
              }}
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
          <button
            type="submit"
            aria-label="Search"
            style={{
              padding: '10px 14px',
              backgroundColor: colors.primary,
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <svg
              width="15"
              height="15"
              fill="none"
              stroke="white"
              strokeWidth="2.5"
              viewBox="0 0 24 24"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="M21 21l-4.35-4.35" strokeLinecap="round" />
            </svg>
          </button>
        </form>
      </div>
    </div>
  );
}
