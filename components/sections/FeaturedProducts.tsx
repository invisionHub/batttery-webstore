import React from 'react';
import Link from 'next/link';
import { mockBrands } from '@/lib/mock-data';

const colors = {
  primary: '#22C55E',
  secondary: '#0D1B2A',
  white: '#FFFFFF',
  border: '#E5E7EB',
  bgLight: '#F9FAFB',
  textMuted: '#6B7280',
};

const FeaturedBrands: React.FC = () => (
  <section
    style={{
      backgroundColor: colors.bgLight,
      borderTop: `1px solid ${colors.border}`,
      borderBottom: `1px solid ${colors.border}`,
      paddingTop: '40px',
      paddingBottom: '40px',
    }}
  >
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-5 gap-4 items-center">
        {/* First 4 brands */}
        {mockBrands.slice(0, 4).map((brand) => (
          <Link
            key={brand.id}
            href={`/products?brand=${brand.slug}`}
            className="flex items-center justify-center rounded-xl transition-all duration-200"
            style={{
              height: '72px',
              backgroundColor: colors.white,
              border: `1px solid ${colors.border}`,
              textDecoration: 'none',
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.borderColor = colors.primary;
              (e.currentTarget as HTMLAnchorElement).style.boxShadow =
                `0 0 0 2px rgba(34,197,94,0.15)`;
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.borderColor = colors.border;
              (e.currentTarget as HTMLAnchorElement).style.boxShadow = 'none';
            }}
          >
            <span style={{ fontSize: '16px', fontWeight: 900, color: colors.secondary }}>
              {brand.name}
            </span>
          </Link>
        ))}

        {/* +40 More button */}
        <Link
          href="/brands"
          className="flex items-center justify-center rounded-xl transition-all duration-200"
          style={{
            height: '72px',
            backgroundColor: colors.primary,
            textDecoration: 'none',
          }}
          onMouseEnter={(e) =>
            ((e.currentTarget as HTMLAnchorElement).style.backgroundColor = '#16A34A')
          }
          onMouseLeave={(e) =>
            ((e.currentTarget as HTMLAnchorElement).style.backgroundColor = colors.primary)
          }
        >
          <span style={{ fontSize: '14px', fontWeight: 700, color: colors.white }}>
            + {mockBrands.length - 4} More →
          </span>
        </Link>
      </div>
    </div>
  </section>
);

export default FeaturedBrands;
