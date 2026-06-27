'use client';

import React from 'react';
import Link from 'next/link';

const colors = {
  primary: '#22C55E',
  secondary: '#0D1B2A',
  secondaryLight: '#1E3448',
  white: '#FFFFFF',
  textMuted: '#94A3B8',
  border: '#1E3448',
};

const shop = [
  { label: 'Home Lighting', href: '/products?category=led-lighting&type=home' },
  { label: 'Outdoor Lighting', href: '/products?category=led-lighting&type=outdoor' },
  { label: 'Switches & Sockets', href: '/products?category=switches-sockets' },
  { label: 'Appliances', href: '/products?category=appliances' },
  { label: 'Cables & Wiring', href: '/products?category=electric-cables' },
];

const company = [
  { label: 'About Us', href: '/about' },
  { label: 'Our Story', href: '/about#story' },
  { label: 'Store Accounts', href: '/account' },
  { label: 'Blog', href: '/blog' },
];

const customerCare = [
  { label: 'Help Centre', href: '/help' },
  { label: 'Shipping Info', href: '/shipping' },
  { label: 'Returns & Refunds', href: '/returns' },
  { label: 'Warranty', href: '/warranty' },
  { label: 'FAQ', href: '/faq' },
];

const socials = [
  {
    label: 'Facebook',
    href: 'https://facebook.com',
    icon: (
      <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
        <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
      </svg>
    ),
  },
  {
    label: 'Instagram',
    href: 'https://instagram.com',
    icon: (
      <svg
        width="16"
        height="16"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
      >
        <rect x="2" y="2" width="20" height="20" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    label: 'Twitter',
    href: 'https://twitter.com',
    icon: (
      <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  {
    label: 'WhatsApp',
    href: 'https://wa.me/234000000034',
    icon: (
      <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
        <path d="M12 0C5.373 0 0 5.373 0 12c0 2.124.558 4.117 1.533 5.845L.057 23.428a.5.5 0 00.609.61l5.703-1.485A11.945 11.945 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.9 0-3.676-.524-5.198-1.432l-.374-.22-3.878 1.01 1.028-3.768-.242-.386A9.96 9.96 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z" />
      </svg>
    ),
  },
];

const FooterCol = ({
  title,
  links,
}: {
  title: string;
  links: { label: string; href: string }[];
}) => (
  <div className="flex flex-col gap-3">
    <h4
      style={{
        fontSize: '11px',
        fontWeight: 700,
        letterSpacing: '0.1em',
        textTransform: 'uppercase',
        color: colors.white,
        margin: 0,
      }}
    >
      {title}
    </h4>
    <div
      style={{
        width: '28px',
        height: '2px',
        backgroundColor: colors.primary,
        borderRadius: '1px',
      }}
    />
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      {links.map((link) => (
        <div key={link.label}>
          <Link
            href={link.href}
            style={{
              fontSize: '13px',
              color: colors.textMuted,
              textDecoration: 'none',
              transition: 'color 0.15s',
            }}
            onMouseEnter={(e) =>
              ((e.currentTarget as HTMLAnchorElement).style.color = colors.primary)
            }
            onMouseLeave={(e) =>
              ((e.currentTarget as HTMLAnchorElement).style.color = colors.textMuted)
            }
          >
            {link.label}
          </Link>
        </div>
      ))}
    </div>
  </div>
);

const Footer: React.FC = () => (
  <footer style={{ backgroundColor: colors.secondary }}>
    <div
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
      style={{ paddingTop: '56px', paddingBottom: '32px' }}
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10">
        {/* Brand col */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          <Link
            href="/"
            style={{
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '2px',
              width: 'fit-content',
            }}
          >
            <span style={{ fontSize: '24px', fontWeight: 900, color: colors.white }}>Jav</span>
            <span style={{ fontSize: '24px', fontWeight: 900, color: colors.primary }}>aL</span>
            <span
              style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                backgroundColor: colors.primary,
                marginBottom: '10px',
                marginLeft: '-1px',
              }}
            />
          </Link>

          <p
            style={{
              fontSize: '11px',
              fontWeight: 700,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: colors.primary,
              margin: 0,
            }}
          >
            Light &amp; Plug Concept
          </p>

          <p
            style={{
              fontSize: '13px',
              color: colors.textMuted,
              lineHeight: 1.7,
              margin: 0,
              maxWidth: '280px',
            }}
          >
            Your trusted partner for solar panels, lithium batteries, and electrical appliances.
            Powering homes and businesses across Nigeria.
          </p>

          {/* Socials */}
          <div className="flex items-center gap-2 mt-1">
            {socials.map((s) => (
              <Link
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={s.label}
                className="flex items-center justify-center w-8 h-8 rounded-md transition-all duration-200"
                style={{ backgroundColor: colors.secondaryLight, color: colors.textMuted }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.backgroundColor = colors.primary;
                  (e.currentTarget as HTMLAnchorElement).style.color = colors.white;
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.backgroundColor =
                    colors.secondaryLight;
                  (e.currentTarget as HTMLAnchorElement).style.color = colors.textMuted;
                }}
              >
                {s.icon}
              </Link>
            ))}
          </div>
        </div>

        <FooterCol title="Shop" links={shop} />
        <FooterCol title="Company" links={company} />
        <FooterCol title="Customer Care" links={customerCare} />
      </div>

      {/* Bottom bar */}
      <div
        className="flex flex-col sm:flex-row items-center justify-between gap-3 mt-10 pt-6"
        style={{ borderTop: `1px solid ${colors.border}` }}
      >
        <p style={{ fontSize: '12px', color: colors.textMuted, margin: 0 }}>
          © {new Date().getFullYear()} JavaL Light &amp; Plug Concept. All rights reserved.
        </p>
        <div className="flex items-center gap-4">
          {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map((item) => (
            <Link
              key={item}
              href="#"
              style={{ fontSize: '12px', color: colors.textMuted, textDecoration: 'none' }}
              onMouseEnter={(e) =>
                ((e.currentTarget as HTMLAnchorElement).style.color = colors.primary)
              }
              onMouseLeave={(e) =>
                ((e.currentTarget as HTMLAnchorElement).style.color = colors.textMuted)
              }
            >
              {item}
            </Link>
          ))}
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
