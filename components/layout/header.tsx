'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Icon } from '../ui';

const colors = {
  primary: '#22C55E',
  primaryHover: '#16A34A',
  secondary: '#0D1B2A',
  white: '#FFFFFF',
  border: '#E5E7EB',
  textMuted: '#6B7280',
  bgLight: '#F9FAFB',
};

const categoryLinks = [
  { label: 'Lighting', href: '/products?category=led-lighting' },
  { label: 'Switches & Sockets', href: '/products?category=switches-sockets' },
  { label: 'Appliances', href: '/products?category=appliances' },
  { label: 'Cables & Wiring', href: '/products?category=electric-cables' },
  { label: 'Smart Home', href: '/products?category=smart-home' },
  { label: 'Fire & Security', href: '/products?category=fire-security' },
  { label: 'Tools', href: '/products?category=tools' },
  { label: 'Brands', href: '/brands' },
];

const Logo = () => (
  <Link
    href="/"
    style={{
      textDecoration: 'none',
      display: 'flex',
      alignItems: 'center',
      gap: '1px',
      flexShrink: 0,
    }}
  >
    <Icon name="Logo" color={colors.primary} width={70} />
  </Link>
);

const Header: React.FC<{ cartCount?: number }> = ({ cartCount = 0 }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [path, setPath] = useState('/');
  const [search, setSearch] = useState('');

  // useEffect(() => {
  //   if (typeof window !== 'undefined') {
  //     setPath(window.location.pathname);
  //     const onScroll = () => setScrolled(window.scrollY > 10);
  //     window.addEventListener('scroll', onScroll);
  //     return () => window.removeEventListener('scroll', onScroll);
  //   }
  // }, []);

  return (
    <>
      {/* ── Announcement Bar ── */}
      <div
        style={{
          backgroundColor: colors.primary,
          color: colors.white,
          padding: '8px 16px',
          overflow: 'hidden',
          whiteSpace: 'nowrap',
        }}
      >
        <div
          style={{
            display: 'inline-block',
            animation: 'marquee 30s linear infinite',
            fontSize: '12px',
            fontWeight: 600,
            letterSpacing: '0.05em',
          }}
        >
          • FREE DELIVERY ON ORDERS ABOVE ₦50,000 &nbsp;&nbsp;&nbsp; • QUALITY &nbsp;&nbsp;&nbsp; •
          SAFETY &nbsp;&nbsp;&nbsp; • RELIABILITY &nbsp;&nbsp;&nbsp; • SHOP NOW →
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; • FREE DELIVERY
          ON ORDERS ABOVE ₦50,000 &nbsp;&nbsp;&nbsp; • QUALITY &nbsp;&nbsp;&nbsp; • SAFETY
          &nbsp;&nbsp;&nbsp; • RELIABILITY &nbsp;&nbsp;&nbsp; • SHOP NOW →
        </div>
        <style>{`
          @keyframes marquee {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
        `}</style>
      </div>

      {/* ── Main Navbar ── */}
      <header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 30,
          backgroundColor: colors.white,
          borderBottom: `1px solid ${colors.border}`,
          boxShadow: scrolled ? '0 2px 12px rgba(0,0,0,0.08)' : 'none',
          transition: 'box-shadow 0.2s',
        }}
      >
        {/* Top row: Logo + Search + Actions */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4" style={{ height: '64px' }}>
            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileOpen(true)}
              className="lg:hidden flex flex-col gap-1.5"
              aria-label="Menu"
            >
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  style={{
                    display: 'block',
                    width: '22px',
                    height: '2px',
                    backgroundColor: colors.secondary,
                    borderRadius: '2px',
                  }}
                />
              ))}
            </button>

            {/* Logo */}
            <Logo />

            {/* Search bar — center */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (search.trim())
                  window.location.href = `/products?search=${encodeURIComponent(search)}`;
              }}
              className="flex-1 hidden sm:flex items-center rounded-md overflow-hidden"
              style={{
                border: `1.5px solid ${colors.border}`,
                maxWidth: '480px',
              }}
            >
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search for products, brands, categories..."
                className="flex-1 focus:outline-none text-sm px-4 py-2.5"
                style={{ color: colors.secondary, backgroundColor: colors.white }}
              />
              <button
                type="submit"
                className="flex items-center justify-center px-4 py-2.5 font-bold text-sm"
                style={{ backgroundColor: colors.primary, color: colors.white, flexShrink: 0 }}
              >
                Go
              </button>
            </form>

            {/* Right actions */}
            <div className="flex items-center gap-3 ml-auto">
              {/* Wishlist */}
              <Link
                href="/wishlist"
                aria-label="Wishlist"
                style={{ color: colors.secondary, display: 'flex', alignItems: 'center' }}
              >
                <svg
                  width="22"
                  height="22"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  viewBox="0 0 24 24"
                >
                  <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
                </svg>
              </Link>

              {/* Account */}
              <Link
                href="/account"
                aria-label="Account"
                style={{ color: colors.secondary, display: 'flex', alignItems: 'center' }}
              >
                <svg
                  width="22"
                  height="22"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <circle cx="12" cy="7" r="4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>

              {/* Cart */}
              <Link
                href="/cart"
                aria-label="Cart"
                style={{
                  position: 'relative',
                  color: colors.secondary,
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <svg
                  width="22"
                  height="22"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <line x1="3" y1="6" x2="21" y2="6" strokeLinecap="round" />
                  <path d="M16 10a4 4 0 01-8 0" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                {cartCount > 0 && (
                  <span
                    style={{
                      position: 'absolute',
                      top: '-8px',
                      right: '-8px',
                      width: '18px',
                      height: '18px',
                      borderRadius: '50%',
                      backgroundColor: colors.primary,
                      color: colors.white,
                      fontSize: '10px',
                      fontWeight: 700,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {cartCount}
                  </span>
                )}
              </Link>

              {/* Sign In */}
              <Link
                href="/auth/signin"
                className="hidden md:inline-flex items-center rounded-md font-semibold text-sm"
                style={{
                  color: colors.secondary,
                  padding: '8px 14px',
                  border: `1px solid ${colors.border}`,
                  textDecoration: 'none',
                }}
              >
                Sign In
              </Link>

              {/* Open Trade Account */}
              <Link
                href="/trade-account"
                className="hidden lg:inline-flex items-center rounded-md font-semibold text-sm"
                style={{
                  backgroundColor: colors.secondary,
                  color: colors.white,
                  padding: '8px 14px',
                  textDecoration: 'none',
                }}
              >
                Open Trade Acc...
              </Link>
            </div>
          </div>
        </div>

        {/* ── Category Nav Row ── */}
        <div
          style={{
            borderTop: `1px solid ${colors.border}`,
            backgroundColor: colors.white,
          }}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div
              className="hidden lg:flex items-center gap-0 overflow-x-auto"
              style={{ height: '40px' }}
            >
              {categoryLinks.map((link) => {
                const active = path.includes(link.href.split('?')[0]) && link.href !== '/products';
                return (
                  <Link
                    key={link.label}
                    href={link.href}
                    style={{
                      fontSize: '13px',
                      fontWeight: 500,
                      color: active ? colors.primary : colors.secondary,
                      textDecoration: 'none',
                      padding: '0 16px',
                      height: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      borderBottom: active
                        ? `2px solid ${colors.primary}`
                        : '2px solid transparent',
                      whiteSpace: 'nowrap',
                      transition: 'color 0.15s',
                    }}
                    onMouseEnter={(e) =>
                      ((e.currentTarget as HTMLAnchorElement).style.color = colors.primary)
                    }
                    onMouseLeave={(e) =>
                      ((e.currentTarget as HTMLAnchorElement).style.color = active
                        ? colors.primary
                        : colors.secondary)
                    }
                  >
                    {link.label}
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </header>

      {/* ── Mobile Drawer ── */}
      {mobileOpen && (
        <>
          <div
            onClick={() => setMobileOpen(false)}
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 40,
              backgroundColor: 'rgba(13,27,42,0.5)',
            }}
          />
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              height: '100%',
              zIndex: 50,
              width: '280px',
              backgroundColor: colors.white,
              boxShadow: '4px 0 24px rgba(0,0,0,0.12)',
              display: 'flex',
              flexDirection: 'column',
              overflowY: 'auto',
            }}
          >
            {/* Drawer header */}
            <div
              className="flex items-center justify-between px-5 py-4"
              style={{ borderBottom: `1px solid ${colors.border}` }}
            >
              <Logo />
              <button
                onClick={() => setMobileOpen(false)}
                style={{ color: colors.secondary }}
                aria-label="Close menu"
              >
                <svg
                  width="20"
                  height="20"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" />
                </svg>
              </button>
            </div>

            {/* Mobile search */}
            <div className="px-5 py-3" style={{ borderBottom: `1px solid ${colors.border}` }}>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setMobileOpen(false);
                }}
                className="flex items-center rounded-md overflow-hidden"
                style={{ border: `1.5px solid ${colors.border}` }}
              >
                <input
                  type="text"
                  placeholder="Search products..."
                  className="flex-1 focus:outline-none text-sm px-3 py-2"
                  style={{ color: colors.secondary }}
                />
                <button
                  type="submit"
                  className="px-3 py-2"
                  style={{ backgroundColor: colors.primary }}
                  aria-label="Search"
                >
                  <svg
                    width="14"
                    height="14"
                    fill="none"
                    stroke={colors.white}
                    strokeWidth="2.5"
                    viewBox="0 0 24 24"
                  >
                    <circle cx="11" cy="11" r="8" />
                    <path d="M21 21l-4.35-4.35" strokeLinecap="round" />
                  </svg>
                </button>
              </form>
            </div>

            {/* Category links */}
            <nav style={{ display: 'flex', flexDirection: 'column', padding: '8px 0' }}>
              {categoryLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  style={{
                    padding: '12px 20px',
                    fontSize: '14px',
                    fontWeight: 500,
                    color: colors.secondary,
                    textDecoration: 'none',
                    borderBottom: `1px solid ${colors.border}`,
                  }}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Sign in */}
            <div
              style={{
                marginTop: 'auto',
                padding: '20px',
                borderTop: `1px solid ${colors.border}`,
              }}
            >
              <Link
                href="/auth/signin"
                onClick={() => setMobileOpen(false)}
                style={{
                  display: 'block',
                  textAlign: 'center',
                  padding: '10px',
                  borderRadius: '8px',
                  backgroundColor: colors.primary,
                  color: colors.white,
                  fontWeight: 700,
                  fontSize: '14px',
                  textDecoration: 'none',
                }}
              >
                Sign In
              </Link>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Header;
