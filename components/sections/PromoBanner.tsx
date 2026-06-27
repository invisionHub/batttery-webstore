import React from 'react';
import Link from 'next/link';

const colors = {
  primary: '#22C55E',
  primaryHover: '#16A34A',
  secondary: '#0D1B2A',
  secondaryLight: '#1E3448',
  white: '#FFFFFF',
  textMuted: '#94A3B8',
};

const PromoBanner: React.FC = () => (
  <section style={{ backgroundColor: '#F9FAFB', paddingTop: '48px', paddingBottom: '48px' }}>
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Season Sale */}
        <div
          className="relative overflow-hidden rounded-2xl flex flex-col justify-center"
          style={{ backgroundColor: colors.secondary, minHeight: '200px', padding: '40px' }}
        >
          <div
            style={{
              position: 'absolute',
              right: 0,
              top: 0,
              bottom: 0,
              width: '50%',
              background: `radial-gradient(circle at 80% 50%, rgba(34,197,94,0.15), transparent 60%)`,
            }}
          />
          <div
            style={{
              position: 'absolute',
              right: '-40px',
              top: '-40px',
              width: '160px',
              height: '160px',
              borderRadius: '50%',
              backgroundColor: colors.primary,
              opacity: 0.05,
            }}
          />
          <div className="relative z-10 flex flex-col gap-3">
            <span
              style={{
                fontSize: '11px',
                fontWeight: 700,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                backgroundColor: colors.primary,
                color: colors.white,
                padding: '3px 10px',
                borderRadius: '999px',
                width: 'fit-content',
              }}
            >
              Limited Time
            </span>
            <h3
              style={{
                fontSize: '32px',
                fontWeight: 900,
                lineHeight: 1.1,
                color: colors.white,
                margin: 0,
              }}
            >
              Season Sale
              <br />
              <span style={{ color: colors.primary }}>Up to 30%</span>
            </h3>
            <p style={{ fontSize: '13px', color: colors.textMuted, margin: 0 }}>
              On selected solar panels, batteries and electrical fittings.
            </p>
            <Link
              href="/products?badge=sale"
              className="inline-flex items-center gap-2 rounded-md font-bold text-sm transition-all duration-200"
              style={{
                backgroundColor: colors.primary,
                color: colors.white,
                padding: '10px 20px',
                width: 'fit-content',
                marginTop: '4px',
                textDecoration: 'none',
              }}
              onMouseEnter={(e) =>
                ((e.currentTarget as HTMLElement).style.backgroundColor = colors.primaryHover)
              }
              onMouseLeave={(e) =>
                ((e.currentTarget as HTMLElement).style.backgroundColor = colors.primary)
              }
            >
              Shop the Sale →
            </Link>
          </div>
        </div>

        {/* New Arrivals */}
        <div
          className="relative overflow-hidden rounded-2xl flex flex-col justify-center"
          style={{ backgroundColor: colors.secondaryLight, minHeight: '200px', padding: '40px' }}
        >
          <div
            style={{
              position: 'absolute',
              right: 0,
              top: 0,
              bottom: 0,
              width: '50%',
              background: `radial-gradient(circle at 80% 50%, rgba(34,197,94,0.12), transparent 60%)`,
            }}
          />
          <div className="relative z-10 flex flex-col gap-3">
            <span
              style={{
                fontSize: '11px',
                fontWeight: 700,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                backgroundColor: 'rgba(34,197,94,0.15)',
                color: colors.primary,
                padding: '3px 10px',
                borderRadius: '999px',
                width: 'fit-content',
              }}
            >
              Just Arrived
            </span>
            <h3
              style={{
                fontSize: '32px',
                fontWeight: 900,
                lineHeight: 1.1,
                color: colors.white,
                margin: 0,
              }}
            >
              New
              <br />
              <span style={{ color: colors.primary }}>Arrivals</span>
            </h3>
            <p style={{ fontSize: '13px', color: colors.textMuted, margin: 0 }}>
              Fresh stock of solar panels, inverters and smart switches just landed.
            </p>
            <Link
              href="/products?badge=new"
              className="inline-flex items-center gap-2 rounded-md font-bold text-sm transition-all duration-200"
              style={{
                backgroundColor: 'transparent',
                color: colors.primary,
                border: `2px solid ${colors.primary}`,
                padding: '10px 20px',
                width: 'fit-content',
                marginTop: '4px',
                textDecoration: 'none',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.backgroundColor = colors.primary;
                (e.currentTarget as HTMLElement).style.color = colors.white;
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent';
                (e.currentTarget as HTMLElement).style.color = colors.primary;
              }}
            >
              View New Arrivals →
            </Link>
          </div>
        </div>
      </div>
    </div>
  </section>
);

export default PromoBanner;
