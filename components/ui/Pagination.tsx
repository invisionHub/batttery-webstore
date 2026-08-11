'use client';

import React from 'react';

const colors = {
  primary: '#CC0000',
  primaryHover: '#16A34A',
  secondary: '#0D1B2A',
  white: '#FFFFFF',
  border: '#E5E7EB',
  textMuted: '#6B7280',
  bgLight: '#F9FAFB',
};

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  className = '',
}) => {
  if (totalPages <= 1) return null;

  // Build page numbers to show
  const getPages = () => {
    const pages: (number | '...')[] = [];

    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push('...');
      for (
        let i = Math.max(2, currentPage - 1);
        i <= Math.min(totalPages - 1, currentPage + 1);
        i++
      ) {
        pages.push(i);
      }
      if (currentPage < totalPages - 2) pages.push('...');
      pages.push(totalPages);
    }

    return pages;
  };

  const pages = getPages();

  const btnBase: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '36px',
    height: '36px',
    borderRadius: '8px',
    fontSize: '13px',
    fontWeight: 600,
    border: `1px solid ${colors.border}`,
    cursor: 'pointer',
    transition: 'all 0.15s',
    backgroundColor: colors.white,
    color: colors.secondary,
  };

  const activeBtn: React.CSSProperties = {
    ...btnBase,
    backgroundColor: colors.primary,
    color: colors.white,
    border: `1px solid ${colors.primary}`,
  };

  const disabledBtn: React.CSSProperties = {
    ...btnBase,
    opacity: 0.4,
    cursor: 'not-allowed',
  };

  return (
    <div
      className={className}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '6px',
        marginTop: '32px',
      }}
    >
      {/* Prev */}
      <button
        onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        style={currentPage === 1 ? disabledBtn : btnBase}
        aria-label="Previous page"
        onMouseEnter={(e) => {
          if (currentPage !== 1) {
            (e.currentTarget as HTMLButtonElement).style.borderColor = colors.primary;
            (e.currentTarget as HTMLButtonElement).style.color = colors.primary;
          }
        }}
        onMouseLeave={(e) => {
          if (currentPage !== 1) {
            (e.currentTarget as HTMLButtonElement).style.borderColor = colors.border;
            (e.currentTarget as HTMLButtonElement).style.color = colors.secondary;
          }
        }}
      >
        <svg
          width="14"
          height="14"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          viewBox="0 0 24 24"
        >
          <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {/* Page numbers */}
      {pages.map((page, i) =>
        page === '...' ? (
          <span
            key={`dots-${i}`}
            style={{
              width: '36px',
              height: '36px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '13px',
              color: colors.textMuted,
            }}
          >
            …
          </span>
        ) : (
          <button
            key={page}
            onClick={() => onPageChange(page as number)}
            style={page === currentPage ? activeBtn : btnBase}
            onMouseEnter={(e) => {
              if (page !== currentPage) {
                (e.currentTarget as HTMLButtonElement).style.borderColor = colors.primary;
                (e.currentTarget as HTMLButtonElement).style.color = colors.primary;
              }
            }}
            onMouseLeave={(e) => {
              if (page !== currentPage) {
                (e.currentTarget as HTMLButtonElement).style.borderColor = colors.border;
                (e.currentTarget as HTMLButtonElement).style.color = colors.secondary;
              }
            }}
          >
            {page}
          </button>
        )
      )}

      {/* Next */}
      <button
        onClick={() => currentPage < totalPages && onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        style={currentPage === totalPages ? disabledBtn : btnBase}
        aria-label="Next page"
        onMouseEnter={(e) => {
          if (currentPage !== totalPages) {
            (e.currentTarget as HTMLButtonElement).style.borderColor = colors.primary;
            (e.currentTarget as HTMLButtonElement).style.color = colors.primary;
          }
        }}
        onMouseLeave={(e) => {
          if (currentPage !== totalPages) {
            (e.currentTarget as HTMLButtonElement).style.borderColor = colors.border;
            (e.currentTarget as HTMLButtonElement).style.color = colors.secondary;
          }
        }}
      >
        <svg
          width="14"
          height="14"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          viewBox="0 0 24 24"
        >
          <path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {/* Page info */}
      <span
        style={{
          fontSize: '12px',
          color: colors.textMuted,
          marginLeft: '8px',
          whiteSpace: 'nowrap',
        }}
      >
        Page {currentPage} of {totalPages}
      </span>
    </div>
  );
};

export default Pagination;

// --- USAGE ---
// const [page, setPage] = useState(1);
// const ITEMS_PER_PAGE = 12;
// const totalPages = Math.ceil(products.length / ITEMS_PER_PAGE);
// <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
