'use client';

import { Product } from '@/database/types';
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

interface SpecificationsTableProps {
  product: Product;
  className?: string;
}

// Demo spec data — keyed loosely off category, replace with real data later
const getSpecs = (product: Product): { label: string; value: string }[] => [
  {
    label: 'Brand',
    value:
      typeof product.brand === 'string' && product.brand.length > 0
        ? product.brand.charAt(0).toUpperCase() + product.brand.slice(1)
        : 'N/A',
  },
  { label: 'Model Number', value: `JVL-${product.id.toUpperCase()}` },
  {
    label: 'Category',
    value:
      typeof product.category === 'string' && product.category.length > 0
        ? product.category.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
        : 'Uncategorized',
  },
  { label: 'Material', value: 'Premium Polycarbonate / Metal Alloy' },
  { label: 'Color', value: 'Matte Black, Pearl White, Champagne Gold' },
  { label: 'Rated Voltage', value: '220V – 240V AC' },
  { label: 'Rated Current', value: '13A' },
  { label: 'Frequency', value: '50 / 60 Hz' },
  { label: 'IP Rating', value: 'IP20' },
  { label: 'Certification', value: 'CE, RoHS, SONCAP' },
  { label: 'Warranty', value: '2 Years Manufacturer Warranty' },
  { label: 'Country of Origin', value: 'Nigeria / Imported' },
];

const keyFeatures = [
  'Premium build quality with fire-retardant materials',
  'Surge-protected for added safety',
  'Easy snap-fit installation, no special tools required',
  'Compatible with standard wall box sizes',
  'Sleek modern design fits any interior style',
];

const whatsInBox = [
  '1 x Product Unit',
  '1 x Mounting Screws Set',
  '1 x Installation Manual',
  '1 x Warranty Card',
];

const SpecificationsTable: React.FC<SpecificationsTableProps> = ({ product, className = '' }) => {
  const [activeTab, setActiveTab] = useState<'description' | 'specs' | 'reviews'>('description');
  const specs = getSpecs(product);

  const tabs = [
    { id: 'description' as const, label: 'Description' },
    { id: 'specs' as const, label: 'Specifications' },
  ];

  return (
    <div className={className}>
      {/* Tabs */}
      <div
        style={{
          display: 'flex',
          gap: '4px',
          borderBottom: `1px solid ${colors.border}`,
          marginBottom: '24px',
        }}
      >
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: '12px 20px',
              fontSize: '13px',
              fontWeight: 700,
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: activeTab === tab.id ? colors.primary : colors.textMuted,
              borderBottom:
                activeTab === tab.id ? `2px solid ${colors.primary}` : '2px solid transparent',
              marginBottom: '-1px',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Description tab */}
      {activeTab === 'description' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div>
            <h3
              style={{
                fontSize: '15px',
                fontWeight: 700,
                color: colors.secondary,
                margin: '0 0 10px 0',
              }}
            >
              Product Overview
            </h3>
            <p style={{ fontSize: '14px', color: colors.textMuted, lineHeight: 1.8, margin: 0 }}>
              {product.shortDescription ??
                'Built to last with industrial-grade components, this product is designed for both residential and commercial use.'}{' '}
              Every unit is tested for safety and durability before leaving the factory.
            </p>
          </div>

          <div>
            <h3
              style={{
                fontSize: '15px',
                fontWeight: 700,
                color: colors.secondary,
                margin: '0 0 12px 0',
              }}
            >
              Key Features
            </h3>
            <ul
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
                margin: 0,
                padding: 0,
                listStyle: 'none',
              }}
            >
              {keyFeatures.map((feature, i) => (
                <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                  <span
                    style={{
                      width: '18px',
                      height: '18px',
                      borderRadius: '50%',
                      backgroundColor: '#F0FDF4',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      marginTop: '1px',
                    }}
                  >
                    <svg
                      width="10"
                      height="10"
                      fill="none"
                      stroke={colors.primary}
                      strokeWidth="3"
                      viewBox="0 0 24 24"
                    >
                      <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                  <span style={{ fontSize: '13px', color: colors.textMuted, lineHeight: 1.6 }}>
                    {feature}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3
              style={{
                fontSize: '15px',
                fontWeight: 700,
                color: colors.secondary,
                margin: '0 0 12px 0',
              }}
            >
              What is in the Box
            </h3>
            <ul
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
                margin: 0,
                padding: 0,
                listStyle: 'none',
              }}
            >
              {whatsInBox.map((item, i) => (
                <li
                  key={i}
                  style={{
                    fontSize: '13px',
                    color: colors.textMuted,
                    padding: '8px 12px',
                    backgroundColor: colors.bgLight,
                    borderRadius: '6px',
                  }}
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Specifications tab */}
      {activeTab === 'specs' && (
        <div
          style={{
            border: `1px solid ${colors.border}`,
            borderRadius: '10px',
            overflow: 'hidden',
          }}
        >
          {specs.map((spec, i) => (
            <div
              key={spec.label}
              style={{
                display: 'grid',
                gridTemplateColumns: '180px 1fr',
                padding: '12px 16px',
                backgroundColor: i % 2 === 0 ? colors.white : colors.bgLight,
                borderBottom: i < specs.length - 1 ? `1px solid ${colors.border}` : 'none',
              }}
            >
              <span style={{ fontSize: '13px', fontWeight: 600, color: colors.secondary }}>
                {spec.label}
              </span>
              <span style={{ fontSize: '13px', color: colors.textMuted }}>{spec.value}</span>
            </div>
          ))}
        </div>
      )}

      {/* Reviews tab — placeholder summary, full reviews come later */}
    </div>
  );
};

export default SpecificationsTable;
