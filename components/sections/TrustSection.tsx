'use client';

import React from 'react';

const testimonials = [
  {
    quote:
      'We installed 4 units of the 48V 100Ah LiFePO4 batteries with the 5kVA hybrid inverter for our clinic lab. Runtime is flawless, zero downtime during outages, and power output is crystal clean.',
    author: 'Dr. Chidi Okonkwo',
    role: 'Medical Director',
    org: 'St. Michael Diagnostics, Ikeja',
  },
  {
    quote:
      'As a solar installation contractor, getting authentic capacity-tested cells with genuine 2-year warranty was always our bottleneck. Battery Store delivers verified batches with immediate dispatch.',
    author: 'Engr. Tunde Adeleke',
    role: 'Lead Energy Engineer',
    org: 'SolarVolt Engineering',
  },
  {
    quote:
      'The power calculator on the website gave an exact estimate of our residential load. Ordered online and received dispatch to Abuja within 48 hours.',
    author: 'Amina Bello',
    role: 'Homeowner',
    org: 'Gwarinpa Estate, Abuja',
  },
];

export const TrustSection: React.FC = () => {
  return (
    <section className="bg-white py-16 border-t border-slate-200">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="text-xs font-bold uppercase tracking-wider text-[#CC0000]">
            Verified Customer Proof
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
            Trusted by Commercial Facilities &amp; Solar Installers
          </h2>
          <p className="text-sm text-slate-500 mt-2">
            Real installations, authentic performance, and dedicated engineering support.
          </p>
        </div>

        {/* Testimonials 3-column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, idx) => (
            <div
              key={idx}
              className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-slate-50/50 p-6 shadow-xs"
            >
              <div>
                {/* 5 Stars */}
                <div className="flex items-center gap-1 text-amber-400 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} width="16" height="16" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-sm text-slate-700 leading-relaxed italic">
                  &ldquo;{t.quote}&rdquo;
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-200/80">
                <div className="text-sm font-bold text-slate-900">{t.author}</div>
                <div className="text-xs text-slate-500 font-medium">
                  {t.role} · <span className="text-slate-700">{t.org}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Trust Badges Bar */}
        <div className="mt-12 rounded-2xl bg-slate-900 text-white p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-amber-400">
              Technical Standards &amp; Compliance
            </div>
            <div className="text-xl font-bold mt-1">
              Fully Certified for Nigerian Tropical Climate Operations
            </div>
            <p className="text-xs text-slate-300 mt-1 max-w-xl">
              Equipped with smart thermal derating and over-temperature safety cutoffs to ensure safe performance even in 45°C ambient temperatures.
            </p>
          </div>

          <div className="flex items-center gap-4 shrink-0">
            <div className="rounded-lg border border-slate-700 bg-slate-800/80 px-4 py-2 text-center">
              <span className="block text-xs font-bold text-white">CE &amp; RoHS</span>
              <span className="block text-[10px] text-slate-400">Certified Safe</span>
            </div>
            <div className="rounded-lg border border-slate-700 bg-slate-800/80 px-4 py-2 text-center">
              <span className="block text-xs font-bold text-white">SONCAP</span>
              <span className="block text-[10px] text-slate-400">Nigeria Compliant</span>
            </div>
            <div className="rounded-lg border border-slate-700 bg-slate-800/80 px-4 py-2 text-center">
              <span className="block text-xs font-bold text-white">UN38.3</span>
              <span className="block text-[10px] text-slate-400">Transport Certified</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrustSection;
