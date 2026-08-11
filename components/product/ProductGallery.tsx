'use client';

import React, { useState } from 'react';

// ============================================
// BRAND COLORS — change these to update theme
// ============================================
const colors = {
  primary: '#CC0000',
  secondary: '#0D1B2A',
  white: '#FFFFFF',
  border: '#E5E7EB',
  bgLight: '#F9FAFB',
  textMuted: '#6B7280',
};

interface ProductGalleryProps {
  productName: string;
  images?: string[]; // image URLs — falls back to placeholders if empty
  className?: string;
}

// Placeholder for each image slot
const ImagePlaceholder = ({ name, large = false }: { name: string; large?: boolean }) => (
  <div
    style={{
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px',
      backgroundColor: colors.bgLight,
    }}
  >
    <svg width={large ? 56 : 28} height={large ? 56 : 28} fill="none" viewBox="0 0 24 24">
      <rect x="3" y="3" width="18" height="18" rx="2" stroke={colors.border} strokeWidth="1.5" />
      <circle cx="8.5" cy="8.5" r="1.5" stroke={colors.textMuted} strokeWidth="1.5" />
      <path
        d="M21 15l-5-5L5 21"
        stroke={colors.textMuted}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
    {large && (
      <span
        style={{
          fontSize: '12px',
          color: colors.textMuted,
          textAlign: 'center',
          padding: '0 16px',
        }}
      >
        {name}
      </span>
    )}
  </div>
);

const ProductGallery: React.FC<ProductGalleryProps> = ({
  productName,
  images = [],
  className = '',
}) => {
  // Use 4 placeholder slots if no real images provided
  const slots = images.length > 0 ? images : [1, 2, 3, 4];
  const [activeIndex, setActiveIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);

  return (
    <div
      className={className}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        width: '100%',
        maxWidth: '560px',
        margin: '0 auto',
      }}
    >
      {/* Main image */}
      <div
        onMouseEnter={() => setIsZoomed(true)}
        onMouseLeave={() => setIsZoomed(false)}
        style={{
          position: 'relative',
          width: '100%',
          aspectRatio: '1 / 1',
          borderRadius: '12px',
          overflow: 'hidden',
          border: `1px solid ${colors.border}`,
          backgroundColor: colors.bgLight,
          cursor: 'zoom-in',
          boxShadow: '0 1px 3px rgba(15, 23, 42, 0.04)',
        }}
      >
        <div
          style={{
            width: '100%',
            height: '100%',
            transition: 'transform 0.3s ease',
            transform: isZoomed ? 'scale(1.08)' : 'scale(1)',
          }}
        >
          <ImagePlaceholder name={productName} large />
        </div>

        {/* Zoom icon hint */}
        <div
          style={{
            position: 'absolute',
            bottom: '12px',
            right: '12px',
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            backgroundColor: 'rgba(255,255,255,0.9)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 1px 4px rgba(0,0,0,0.1)',
          }}
        >
          <svg
            width="16"
            height="16"
            fill="none"
            stroke={colors.secondary}
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
            <line x1="11" y1="8" x2="11" y2="14" />
            <line x1="8" y1="11" x2="14" y2="11" />
          </svg>
        </div>
      </div>

      {/* Thumbnails */}
      <div
        style={{
          display: 'flex',
          gap: '10px',
          overflowX: 'auto',
          paddingBottom: '4px',
          scrollbarWidth: 'thin',
          justifyContent: 'flex-start',
          alignItems: 'center',
        }}
      >
        {slots.map((_, i) => (
          <button
            key={i}
            onClick={() => setActiveIndex(i)}
            aria-label={`View image ${i + 1}`}
            style={{
              width: '72px',
              height: '72px',
              flex: '0 0 72px',
              borderRadius: '8px',
              overflow: 'hidden',
              border: `2px solid ${activeIndex === i ? colors.primary : colors.border}`,
              cursor: 'pointer',
              padding: 0,
              transition: 'border-color 0.15s',
              backgroundColor: colors.bgLight,
            }}
          >
            <ImagePlaceholder name="" />
          </button>
        ))}
      </div>
    </div>
  );
};

export default ProductGallery;
