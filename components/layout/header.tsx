'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useCartStore } from '@/store/cartStore';
import { useUIStore } from '@/store/uiStore';
import CartDrawer from '@/components/cart/CartDrawer';
import Image from 'next/image';

const navLinks = [
  { label: 'All Products', href: '/products' },
  { label: 'Batteries & Acc', href: '/products?category=Accessories' },
  { label: 'Inverters & Solar', href: '/products?category=Switches' },
  { label: 'Protection & MCCB', href: '/products?category=MCCB%20%26%20Protection' },
  { label: 'Sockets & Panels', href: '/products?category=Sockets' },
  { label: 'Power Calculator', href: '/#battery-calculator' },
];

export const Header: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);
  const [search, setSearch] = useState('');
  const pathname = usePathname();
  const router = useRouter();

  const cartItemCount = useCartStore((state) => state.getItemCount());
  const { openCartDrawer } = useUIStore();

  useEffect(() => {
    void Promise.resolve().then(() => setHasMounted(true));

    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll();

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) {
      router.push(`/products?search=${encodeURIComponent(search.trim())}`);
      setMobileOpen(false);
    }
  };

  return (
    <>
      {/* Announcement Bar */}
      <div className="bg-[#CC0000] text-white py-2 px-4 text-xs font-semibold tracking-wide">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-amber-300 animate-pulse" />
            <span>2-YEAR DIRECT WARRANTY · 100% CAPACITY TESTED LI-ION &amp; POWER SYSTEMS</span>
          </div>
          <div className="hidden md:flex items-center gap-4 text-white/90">
            <span>Free Delivery on qualifying orders</span>
            <span aria-hidden="true">·</span>
            <span>Tel: +234 800-BATTERY</span>
          </div>
        </div>
      </div>

      {/* Main Navbar: Top Bar Contract (Brand - Nav Links - Actions) */}
      <header
        className={`sticky top-0 z-40 bg-white border-b border-slate-200 transition-shadow duration-200 ${
          scrolled ? 'shadow-md shadow-slate-900/5' : ''
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-6 h-18">
            {/* Zone 1: Brand */}
            <div className="flex items-center gap-3 shrink-0">
              <button
                onClick={() => setMobileOpen(true)}
                className="lg:hidden p-2 -ml-2 rounded-lg text-slate-700 hover:bg-slate-100 cursor-pointer"
                aria-label="Open mobile navigation menu"
              >
                <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M4 6h16M4 12h16M4 18h16" strokeLinecap="round" />
                </svg>
              </button>

              <Link href="/" className="flex items-center gap-2.5">
                <Image
                  src="/images/logo.png"
                  alt="Battery Store &amp; Electrical"
                  width={140}
                  height={42}
                  className="h-10 w-auto object-contain"
                  priority
                />
              </Link>
            </div>

            {/* Zone 2: Navigation Links (Desktop) */}
            <nav className="hidden lg:flex items-center gap-6 text-sm font-semibold text-slate-700">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.label}
                    href={link.href}
                    className={`transition-colors py-1 relative ${
                      isActive
                        ? 'text-[#CC0000] font-bold'
                        : 'hover:text-[#CC0000] text-slate-700'
                    }`}
                  >
                    {link.label}
                    {isActive && (
                      <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#CC0000] rounded-full" />
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Zone 3: Search & Actions */}
            <div className="flex items-center gap-3 shrink-0">
              {/* Search Bar */}
              <form onSubmit={handleSearchSubmit} className="hidden sm:flex items-center relative w-48 lg:w-64">
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search batteries, MCCB..."
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg pl-3 pr-8 py-2 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-red-500 focus:bg-white"
                />
                <button
                  type="submit"
                  aria-label="Submit search"
                  className="absolute right-2 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <circle cx="11" cy="11" r="8" />
                    <path d="M21 21l-4.35-4.35" strokeLinecap="round" />
                  </svg>
                </button>
              </form>

              {/* Cart Drawer Trigger */}
              <button
                onClick={openCartDrawer}
                aria-label="View shopping cart"
                className="relative flex items-center justify-center p-2.5 rounded-lg border border-slate-200 text-slate-800 hover:bg-slate-50 hover:border-slate-300 transition-colors cursor-pointer"
              >
                <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" strokeLinecap="round" strokeLinejoin="round" />
                  <line x1="3" y1="6" x2="21" y2="6" strokeLinecap="round" />
                  <path d="M16 10a4 4 0 01-8 0" strokeLinecap="round" strokeLinejoin="round" />
                </svg>

                {hasMounted && cartItemCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-[#CC0000] text-white text-[11px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-xs">
                    {cartItemCount > 99 ? '99+' : cartItemCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Menu */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileOpen(false)}
          />
          <div className="relative w-full max-w-xs bg-white h-full shadow-2xl flex flex-col z-10 p-5 overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
              <Image
                src="/images/logo.png"
                alt="Battery Store"
                width={120}
                height={36}
                className="h-8 w-auto object-contain"
              />
              <button
                onClick={() => setMobileOpen(false)}
                className="p-1 rounded-lg text-slate-500 hover:text-slate-900 cursor-pointer"
                aria-label="Close menu"
              >
                <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" />
                </svg>
              </button>
            </div>

            {/* Mobile Search */}
            <form onSubmit={handleSearchSubmit} className="mt-4 flex items-center relative">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search products..."
                className="w-full text-sm bg-slate-50 border border-slate-200 rounded-lg pl-3 pr-8 py-2.5 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-red-500"
              />
              <button
                type="submit"
                aria-label="Submit search"
                className="absolute right-2 text-slate-500"
              >
                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <circle cx="11" cy="11" r="8" />
                  <path d="M21 21l-4.35-4.35" strokeLinecap="round" />
                </svg>
              </button>
            </form>

            {/* Mobile Links */}
            <nav className="mt-6 flex flex-col divide-y divide-slate-100">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="py-3 text-sm font-semibold text-slate-800 hover:text-[#CC0000] transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            <div className="mt-auto pt-6 border-t border-slate-200 text-xs text-slate-500">
              <p className="font-semibold text-slate-700">Battery Store &amp; Electrical</p>
              <p className="mt-1">Mon - Sat: 8:00 AM - 6:00 PM</p>
              <p>Certified Sales &amp; Technical Support</p>
            </div>
          </div>
        </div>
      )}

      {/* Cart Drawer */}
      <CartDrawer />
    </>
  );
};

export default Header;
