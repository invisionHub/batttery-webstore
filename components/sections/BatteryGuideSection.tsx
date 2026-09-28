'use client';

import React from 'react';

const comparisonRows = [
  {
    feature: 'Cycle Lifespan (Daily Usage)',
    lithium: '4,000 to 6,000 cycles (10–15 years)',
    tubular: '1,200 to 1,800 cycles (3–5 years)',
    winner: 'lithium',
  },
  {
    feature: 'Usable Depth of Discharge (DoD)',
    lithium: 'Up to 90% usable with zero damage',
    tubular: 'Maximum 50% to prevent sulfation',
    winner: 'lithium',
  },
  {
    feature: 'Charge Speed (0 to 100%)',
    lithium: '2 to 3 hours rapid charging',
    tubular: '8 to 10 hours slow absorption',
    winner: 'lithium',
  },
  {
    feature: 'Maintenance & Acid Fumes',
    lithium: '100% Zero maintenance / No acid smell',
    tubular: 'Requires periodic distilled water top-up',
    winner: 'lithium',
  },
  {
    feature: 'Weight & Space Footprint',
    lithium: '65% lighter, compact wall mountable',
    tubular: 'Heavy lead plates, bulky floor footprint',
    winner: 'lithium',
  },
  {
    feature: 'Total Cost per kWh Over Lifetime',
    lithium: 'Lowest (due to 10+ year longevity)',
    tubular: 'Higher long-term replacement cost',
    winner: 'lithium',
  },
];

const glossaryItems = [
  {
    term: 'Ampere-Hour (Ah)',
    definition: 'The fuel tank capacity of your battery. A 200Ah battery can deliver 20 Amps for 10 hours, or 100 Amps for 2 hours.',
  },
  {
    term: 'LiFePO4 (Lithium Iron Phosphate)',
    definition: 'The safest, longest-lasting lithium chemistry. It will not catch fire or overheat under extreme tropical conditions.',
  },
  {
    term: 'Pure Sine Wave',
    definition: 'Clean electrical output identical to or better than grid power, preventing humming, overheating, or damage to sensitive electronics.',
  },
  {
    term: 'Smart BMS (Battery Management System)',
    definition: 'The internal computer protecting your battery against over-voltage, short circuit, deep discharge, and high temperatures.',
  },
];

export const BatteryGuideSection: React.FC = () => {
  return (
    <section className="bg-slate-50 py-16 border-t border-slate-200">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mb-10">
          <div className="text-xs font-bold uppercase tracking-wider text-[#CC0000]">
            Buyer&apos;s Engineering Guide
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
            Understanding Battery Chemistry &amp; Specs
          </h2>
          <p className="text-sm text-slate-600 mt-2">
            Make an informed investment. Compare modern Lithium Iron Phosphate (LiFePO4) against traditional Lead-Acid/Gel storage.
          </p>
        </div>

        {/* Comparison Table */}
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-100/70 text-xs font-bold uppercase tracking-wider text-slate-700">
                  <th className="py-4 px-6">Specification Metric</th>
                  <th className="py-4 px-6 text-[#CC0000] bg-red-50/50">
                    LiFePO4 Lithium (Recommended)
                  </th>
                  <th className="py-4 px-6 text-slate-600">
                    Tubular / Sealed Gel Lead-Acid
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {comparisonRows.map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-4 px-6 font-semibold text-slate-900">
                      {row.feature}
                    </td>
                    <td className="py-4 px-6 font-medium text-slate-800 bg-red-50/20">
                      <span className="inline-flex items-center gap-1.5 text-emerald-700 font-bold">
                        <svg width="14" height="14" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        {row.lithium}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-slate-500 font-normal">
                      {row.tubular}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Interactive Specification Glossary */}
        <div className="mt-12">
          <h3 className="text-lg font-bold text-slate-900 mb-4">
            Specification Glossary: What do these ratings mean?
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {glossaryItems.map((item, i) => (
              <div
                key={i}
                className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs transition-all hover:border-slate-300"
              >
                <div className="flex items-center gap-2 font-bold text-sm text-slate-900">
                  <span className="w-2 h-2 rounded-full bg-[#CC0000]" />
                  <span>{item.term}</span>
                </div>
                <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                  {item.definition}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default BatteryGuideSection;
