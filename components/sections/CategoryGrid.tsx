'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

const categoriesData = [
  {
    title: 'Lithium & Deep Cycle Batteries',
    subtitle: '12V, 24V & 48V LiFePO4 / Gel energy storage',
    href: '/products?category=Accessories',
    image: '/images/generated/category_lithium_batteries_1790629180953.jpg',
    featured: true,
    tag: 'Highest Demand',
  },
  {
    title: 'Hybrid Inverters & Chargers',
    subtitle: 'Pure sine wave solar and grid backup systems',
    href: '/products?category=Switches',
    image: '/images/generated/category_inverter_power_1790629195645.jpg',
    featured: false,
    tag: 'High Efficiency',
  },
  {
    title: 'MCCB & Power Protection',
    subtitle: 'Industrial circuit breakers, isolators & surge arresters',
    href: '/products?category=MCCB%20%26%20Protection',
    image: '/images/generated/category_protection_mccb_1790629206361.jpg',
    featured: false,
    tag: 'Certified Safety',
  },
  {
    title: 'Distribution Boards & Sockets',
    subtitle: 'Heavy-duty power distribution panels & enclosures',
    href: '/products?category=Distribution%20Boards',
    image: '/images/generated/hero_battery_power_system_1790629169421.jpg',
    featured: false,
    tag: 'Commercial Grade',
  },
];

const CategoryGrid: React.FC = () => {
  return (
    <section className="bg-slate-50 py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-[#CC0000]">
              Engineered Product Categories
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
              Shop by Power &amp; Electrical System
            </h2>
            <p className="text-sm text-slate-500 mt-1 max-w-lg">
              Explore specialized battery banks, solar inverters, and electrical protection built to meet standard Nigerian and international electrical codes.
            </p>
          </div>
          <Link
            href="/products"
            className="inline-flex items-center gap-1.5 text-sm font-bold text-[#CC0000] hover:text-[#B30000] transition-colors shrink-0"
          >
            <span>View All Categories</span>
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        </div>

        {/* Category Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categoriesData.map((cat, idx) => (
            <Link
              key={idx}
              href={cat.href}
              className="group relative flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-slate-300"
            >
              {/* Category Image */}
              <div className="relative h-48 w-full overflow-hidden bg-slate-100">
                <Image
                  src={cat.image}
                  alt={cat.title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-950/20 to-transparent" />
                
                {/* Quiet tag */}
                <div className="absolute top-3 left-3 rounded-md bg-white/90 px-2 py-0.5 text-[10px] font-bold text-slate-900 backdrop-blur-xs">
                  {cat.tag}
                </div>
              </div>

              {/* Category Details */}
              <div className="flex flex-1 flex-col justify-between p-5">
                <div>
                  <h3 className="text-base font-bold text-slate-900 group-hover:text-[#CC0000] transition-colors leading-snug">
                    {cat.title}
                  </h3>
                  <p className="mt-1 text-xs text-slate-500 leading-relaxed">
                    {cat.subtitle}
                  </p>
                </div>

                <div className="mt-4 flex items-center gap-1.5 text-xs font-bold text-[#CC0000]">
                  <span>Explore Series</span>
                  <svg
                    width="14"
                    height="14"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    className="transition-transform group-hover:translate-x-1"
                  >
                    <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoryGrid;
