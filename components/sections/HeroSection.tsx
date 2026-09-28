'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

const HeroSection: React.FC = () => {
  return (
    <section className="relative overflow-hidden bg-[#0D1B2A] text-white">
      {/* Subtle brand ambient glow */}
      <div
        className="pointer-events-none absolute -top-40 right-1/4 h-96 w-96 rounded-full opacity-20 blur-3xl"
        style={{
          background: 'radial-gradient(circle, #CC0000 0%, transparent 70%)',
        }}
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute bottom-0 left-10 h-72 w-72 rounded-full opacity-15 blur-3xl"
        style={{
          background: 'radial-gradient(circle, #F59E0B 0%, transparent 70%)',
        }}
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12">
          {/* LEFT: Headline & Value Proposition */}
          <div className="flex flex-col gap-6 lg:col-span-7">
            {/* Kicker badge without generic AI pills */}
            <div className="flex items-center gap-2 text-xs font-semibold tracking-wider text-amber-400 uppercase">
              <span className="inline-block h-2 w-2 rounded-full bg-red-600 animate-pulse" />
              <span>Certified Industrial &amp; Residential Power Systems</span>
            </div>

            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl text-white leading-tight">
              High-Performance{' '}
              <span className="text-[#CC0000] inline-block">Batteries &amp; Power</span>{' '}
              Engineered to Last.
            </h1>

            <p className="max-w-xl text-base text-slate-300 leading-relaxed sm:text-lg">
              Equip your home, solar system, or industrial facility with certified deep-cycle lithium batteries, pure sine-wave inverters, and heavy-duty electrical protection. Built for relentless reliability.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                href="/products"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#CC0000] px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-red-900/40 transition-all duration-150 hover:bg-[#B30000] hover:scale-[1.02] active:scale-[0.99] focus-visible:outline-2 focus-visible:outline-red-500"
              >
                <span>Shop Batteries &amp; Power</span>
                <svg
                  width="16"
                  height="16"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  viewBox="0 0 24 24"
                  className="transition-transform group-hover:translate-x-0.5"
                >
                  <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>

              <a
                href="#battery-calculator"
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-700 bg-slate-800/80 px-6 py-3.5 text-sm font-semibold text-white transition-all duration-150 hover:border-slate-500 hover:bg-slate-700/80"
              >
                <svg
                  width="16"
                  height="16"
                  fill="none"
                  stroke="#F59E0B"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <rect x="4" y="2" width="16" height="20" rx="2" strokeWidth="2" />
                  <line x1="8" y1="6" x2="16" y2="6" strokeWidth="2" />
                  <line x1="8" y1="10" x2="16" y2="10" strokeWidth="2" />
                  <line x1="8" y1="14" x2="10" y2="14" strokeWidth="2" />
                  <line x1="14" y1="14" x2="16" y2="14" strokeWidth="2" />
                  <line x1="8" y1="18" x2="10" y2="18" strokeWidth="2" />
                  <line x1="14" y1="18" x2="16" y2="18" strokeWidth="2" />
                </svg>
                <span>Calculate Your Load</span>
              </a>
            </div>

            {/* Quick Proof Metrics */}
            <div className="grid grid-cols-3 gap-6 pt-6 border-t border-slate-800 max-w-lg">
              <div>
                <div className="text-2xl font-black text-white tabular-nums">4,000+</div>
                <div className="text-xs text-slate-400 mt-0.5 font-medium">Cycle Life Rating</div>
              </div>
              <div>
                <div className="text-2xl font-black text-[#CC0000] tabular-nums">2-Year</div>
                <div className="text-xs text-slate-400 mt-0.5 font-medium">Direct Warranty</div>
              </div>
              <div>
                <div className="text-2xl font-black text-amber-400 tabular-nums">100%</div>
                <div className="text-xs text-slate-400 mt-0.5 font-medium">Capacity Tested</div>
              </div>
            </div>
          </div>

          {/* RIGHT: High-Fidelity Product Showcase */}
          <div className="relative lg:col-span-5">
            <div className="relative mx-auto w-full max-w-md overflow-hidden rounded-2xl border border-slate-700/60 bg-gradient-to-b from-slate-800/80 to-slate-900/90 p-4 shadow-2xl shadow-black/60 backdrop-blur-xs">
              {/* Product Visual */}
              <div className="relative h-72 sm:h-80 w-full overflow-hidden rounded-xl bg-slate-950">
                <Image
                  src="/images/generated/hero_battery_power_system_1790629169421.jpg"
                  alt="High-capacity Lithium LiFePO4 Battery & Hybrid Solar Inverter System"
                  fill
                  priority
                  sizes="(max-width: 768px) 100vw, 480px"
                  className="object-cover transition-transform duration-500 hover:scale-105"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent pointer-events-none" />

                {/* Overlaid Live Spec Badge */}
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between rounded-lg bg-slate-900/90 px-3 py-2 border border-slate-700/80 backdrop-blur-md">
                  <div>
                    <span className="block text-[10px] font-bold uppercase tracking-wider text-amber-400">
                      Featured Industrial System
                    </span>
                    <span className="block text-xs font-semibold text-white truncate max-w-[200px]">
                      LiFePO4 Power Backup Unit
                    </span>
                  </div>
                  <span className="text-xs font-black text-emerald-400">
                    In Stock · Ships Today
                  </span>
                </div>
              </div>

              {/* Quick specs breakdown */}
              <div className="mt-4 grid grid-cols-2 gap-3 text-xs">
                <div className="rounded-lg bg-slate-800/60 p-2.5 border border-slate-700/40">
                  <span className="block text-[11px] text-slate-400">Standard Output</span>
                  <span className="font-bold text-white">48V · 100Ah / 5.12kWh</span>
                </div>
                <div className="rounded-lg bg-slate-800/60 p-2.5 border border-slate-700/40">
                  <span className="block text-[11px] text-slate-400">Protection Circuit</span>
                  <span className="font-bold text-white">Smart BMS &amp; Thermal Cutoff</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
