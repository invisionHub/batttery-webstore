import React from 'react';

// ============================================
// BRAND COLORS — change these to update theme
// ============================================
const colors = {
  base: '#E5E7EB',
  shine: '#F9FAFB',
};

interface SkeletonProps {
  width?: string | number;
  height?: string | number;
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'full';
  className?: string;
}

const roundedMap = {
  none: '0px',
  sm: '4px',
  md: '8px',
  lg: '16px',
  full: '9999px',
};

const Skeleton: React.FC<SkeletonProps> = ({
  width = '100%',
  height = '16px',
  rounded = 'md',
  className = '',
}) => (
  <>
    <div
      className={className}
      style={{
        width,
        height,
        borderRadius: roundedMap[rounded],
        background: `linear-gradient(90deg, ${colors.base} 25%, ${colors.shine} 50%, ${colors.base} 75%)`,
        backgroundSize: '200% 100%',
        animation: 'javal-shimmer 1.5s infinite',
        flexShrink: 0,
      }}
    />
    <style>{`
      @keyframes javal-shimmer {
        0% { background-position: 200% 0; }
        100% { background-position: -200% 0; }
      }
    `}</style>
  </>
);

export const ProductCardSkeleton: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`flex flex-col gap-3 ${className}`}>
    <Skeleton height="200px" rounded="md" />
    <Skeleton height="14px" width="80%" rounded="sm" />
    <Skeleton height="12px" width="50%" rounded="sm" />
    <div className="flex items-center gap-2">
      <Skeleton height="20px" width="60px" rounded="sm" />
      <Skeleton height="20px" width="80px" rounded="sm" />
    </div>
  </div>
);

export const TextSkeleton: React.FC<{ lines?: number; className?: string }> = ({
  lines = 3,
  className = '',
}) => (
  <div className={`flex flex-col gap-2 ${className}`}>
    {Array.from({ length: lines }).map((_, i) => (
      <Skeleton key={i} height="14px" width={i === lines - 1 ? '65%' : '100%'} rounded="sm" />
    ))}
  </div>
);

export const CategoryCardSkeleton: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`flex flex-col gap-2 ${className}`}>
    <Skeleton height="160px" rounded="lg" />
    <Skeleton height="16px" width="60%" rounded="sm" />
  </div>
);

export const PageSkeleton: React.FC = () => (
  <div className="w-full max-w-7xl mx-auto px-4 py-8 flex flex-col gap-8">
    <Skeleton height="48px" width="40%" rounded="md" />
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <CategoryCardSkeleton key={i} />
      ))}
    </div>
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
      {Array.from({ length: 5 }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  </div>
);

export default Skeleton;
