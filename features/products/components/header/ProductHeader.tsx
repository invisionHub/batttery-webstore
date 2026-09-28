import Link from 'next/link';

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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-4">
      {/* Breadcrumb without pills */}
      <nav className="flex items-center gap-2 text-xs text-slate-500 mb-4">
        <Link href="/" className="hover:text-slate-900 transition-colors">
          Home
        </Link>
        <span aria-hidden="true">/</span>
        <span className="font-semibold text-slate-900">Battery &amp; Power Catalog</span>
      </nav>

      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Battery &amp; Electrical Equipment Catalog
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Showing <span className="font-bold text-slate-800 tabular-nums">{resultCount}</span> {resultCount === 1 ? 'verified product' : 'verified products'} in stock
          </p>
        </div>

        {/* Server Search form */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSearchSubmit?.();
          }}
          className="flex items-center rounded-xl overflow-hidden w-full sm:w-80 border border-slate-300 bg-white shadow-xs focus-within:ring-2 focus-within:ring-red-500 focus-within:border-transparent transition-all"
        >
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search batteries, inverters, SKU..."
            className="flex-1 px-3.5 py-2.5 text-xs text-slate-900 placeholder:text-slate-400 bg-transparent focus:outline-none"
          />
          {search && (
            <button
              type="button"
              onClick={() => {
                setSearch('');
                onSearchSubmit?.();
              }}
              aria-label="Clear search query"
              className="p-1.5 text-slate-400 hover:text-slate-700 cursor-pointer"
            >
              <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" />
              </svg>
            </button>
          )}
          <button
            type="submit"
            aria-label="Submit search"
            className="px-4 py-2.5 bg-[#CC0000] hover:bg-[#B30000] text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="8" />
              <path d="M21 21l-4.35-4.35" strokeLinecap="round" />
            </svg>
          </button>
        </form>
      </div>
    </div>
  );
}
