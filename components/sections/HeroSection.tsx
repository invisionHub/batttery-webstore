'use client';

import React from 'react';
import Link from 'next/link';

const colors = {
  primary: '#22C55E',
  primaryHover: '#16A34A',
  secondary: '#0D1B2A',
  white: '#FFFFFF',
  textMuted: '#94A3B8',
};

const HeroSection: React.FC = () => {
  return (
    <section style={{ backgroundColor: colors.secondary, minHeight: '520px' }}>
      <div
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
        style={{ paddingTop: '64px', paddingBottom: '64px' }}
      >
        <div className="flex flex-col md:flex-row items-center justify-between gap-12">
          {/* LEFT */}
          <div className="flex flex-col gap-6 max-w-xl">
            <h1
              style={{
                fontSize: 'clamp(2.5rem, 5vw, 4rem)',
                fontWeight: 900,
                lineHeight: 1.1,
                letterSpacing: '-0.02em',
                margin: 0,
              }}
            >
              <span style={{ color: colors.white }}>Power Your</span>
              <br />
              <span style={{ color: colors.primary }}>Home &amp; Office</span>
              <br />
              <span style={{ color: colors.white }}>With Confidence</span>
            </h1>

            <p
              style={{
                color: colors.textMuted,
                fontSize: '15px',
                lineHeight: 1.7,
                maxWidth: '420px',
                margin: 0,
              }}
            >
              Premium electrical products — lights, plugs, appliances and everything in between.
              Quality you can trust.
            </p>

            {/* Buttons */}
            <div className="flex flex-wrap items-center gap-3">
              <Link
                href="/products"
                className="inline-flex items-center gap-2 font-bold text-sm rounded-md transition-all duration-200"
                style={{
                  backgroundColor: colors.primary,
                  color: colors.white,
                  padding: '12px 24px',
                }}
                onMouseEnter={(e) =>
                  ((e.currentTarget as HTMLElement).style.backgroundColor = colors.primaryHover)
                }
                onMouseLeave={(e) =>
                  ((e.currentTarget as HTMLElement).style.backgroundColor = colors.primary)
                }
              >
                Shop Now
                <svg
                  width="16"
                  height="16"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  viewBox="0 0 24 24"
                >
                  <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>

              <Link
                href="/catalogue"
                className="inline-flex items-center font-bold text-sm rounded-md transition-all duration-200"
                style={{
                  backgroundColor: 'transparent',
                  color: colors.white,
                  padding: '12px 24px',
                  border: '2px solid rgba(255,255,255,0.25)',
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = colors.primary;
                  (e.currentTarget as HTMLElement).style.color = colors.primary;
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.25)';
                  (e.currentTarget as HTMLElement).style.color = colors.white;
                }}
              >
                View Catalogue
              </Link>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-8 pt-2">
              {[
                { value: '500+', label: 'Products' },
                { value: '10k+', label: 'Customers' },
                { value: '5★', label: 'Rated' },
              ].map((stat) => (
                <div key={stat.label}>
                  <div
                    style={{
                      color: colors.primary,
                      fontWeight: 900,
                      fontSize: '22px',
                      lineHeight: 1,
                    }}
                  >
                    {stat.value}
                  </div>
                  <div style={{ color: colors.textMuted, fontSize: '12px', marginTop: '2px' }}>
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT — JL Logo Mark */}
          <div className="flex-shrink-0">
            <div
              className="flex items-center justify-center relative rounded-2xl"
              style={{
                width: '240px',
                height: '240px',
                backgroundColor: '#0F2337',
                border: `2px solid ${colors.primary}`,
                boxShadow: `0 0 40px rgba(34,197,94,0.15)`,
              }}
            >
              {/* Glow */}
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  borderRadius: '16px',
                  background: `radial-gradient(circle at 30% 30%, rgba(34,197,94,0.12), transparent 60%)`,
                }}
              />
              {/* Plug pins */}
              <div
                style={{
                  position: 'absolute',
                  top: '20px',
                  right: '24px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '6px',
                }}
              >
                {[0, 1].map((i) => (
                  <div
                    key={i}
                    style={{
                      width: '5px',
                      height: '18px',
                      borderRadius: '3px',
                      backgroundColor: colors.primary,
                      opacity: 0.7,
                    }}
                  />
                ))}
              </div>
              {/* JL text */}
              <div className="flex items-end gap-1 relative z-10">
                <span
                  style={{ fontSize: '72px', fontWeight: 900, color: colors.white, lineHeight: 1 }}
                >
                  J
                </span>
                <span
                  style={{
                    fontSize: '72px',
                    fontWeight: 900,
                    color: colors.primary,
                    lineHeight: 1,
                  }}
                >
                  L
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
