import React from 'react';
import Link from 'next/link';
import { mockCategories } from '@/lib/mock-data';
import Image from 'next/image';

const colors = {
  primary: '#CC0000',
  secondary: '#0D1B2A',
  white: '#FFFFFF',
  border: '#E5E7EB',
  bgLight: '#F9FAFB',
  textMuted: '#6B7280',
  overlay: 'rgba(13,27,42,0.5)',
};

const CategoryCard = ({
  category,
  height = 160,
}: {
  category: (typeof mockCategories)[0];
  height?: number;
}) => (
  <Link
    href={`/products?category=${category.slug}`}
    className="relative overflow-hidden rounded-xl block group"
    style={{ height: `${height}px`, backgroundColor: colors.bgLight }}
  >
    {/* Placeholder bg */}
    <Image
      src={category.image}
      alt={category.name}
      fill
      style={{ objectFit: 'cover' }}
      className="absolute inset-0"
    />

    {/* Overlay */}
    <div
      className="absolute inset-0 transition-opacity duration-300"
      style={{ backgroundColor: colors.overlay, opacity: 0.6 }}
    />

    {/* Label */}
    <div className="absolute bottom-0 left-0 right-0 p-3">
      <p style={{ color: colors.white, fontSize: '13px', fontWeight: 700, margin: 0 }}>
        {category.name}
      </p>
      <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: '11px', margin: 0 }}>
        {category.productCount} products
      </p>
    </div>

    {/* Hover arrow */}
    <div
      className="absolute top-3 right-3 w-7 h-7 rounded-full flex items-center justify-center transition-all duration-200 opacity-0 group-hover:opacity-100"
      style={{ backgroundColor: colors.primary }}
    >
      <svg
        width="12"
        height="12"
        fill="none"
        stroke={colors.white}
        strokeWidth="2.5"
        viewBox="0 0 24 24"
      >
        <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  </Link>
);

const CategoryGrid: React.FC = () => {
  const [large, second, third, ...rest] = mockCategories;
  const bottomRow = rest.slice(0, 4);

  return (
    <section style={{ backgroundColor: colors.bgLight, paddingTop: '48px', paddingBottom: '48px' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 style={{ fontSize: '22px', fontWeight: 900, color: colors.secondary, margin: 0 }}>
              Shop by Category
            </h2>
            <div
              style={{
                width: '40px',
                height: '3px',
                backgroundColor: colors.primary,
                borderRadius: '2px',
                marginTop: '6px',
              }}
            />
          </div>
          <Link
            href="/categories"
            style={{
              color: colors.primary,
              fontSize: '13px',
              fontWeight: 600,
              textDecoration: 'none',
            }}
          >
            Browse all categories →
          </Link>
        </div>

        {/* Top row: large left + 2 stacked right */}
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="col-span-2">
            <CategoryCard category={large} height={260} />
          </div>
          <div className="flex flex-col gap-4">
            <CategoryCard category={second} height={120} />
            <CategoryCard category={third} height={120} />
          </div>
        </div>

        {/* Bottom row: 4 equal */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {bottomRow.map((cat) => (
            <CategoryCard key={cat.id} category={cat} height={150} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoryGrid;
