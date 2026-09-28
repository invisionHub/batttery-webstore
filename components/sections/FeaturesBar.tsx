import React from 'react';

const trustFeatures = [
  {
    icon: (
      <svg width="28" height="28" fill="none" stroke="#CC0000" strokeWidth="2" viewBox="0 0 24 24">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M9 12l2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    title: '2-Year Direct Warranty',
    subtitle: '100% capacity tested & certified cells',
  },
  {
    icon: (
      <svg width="28" height="28" fill="none" stroke="#CC0000" strokeWidth="2" viewBox="0 0 24 24">
        <rect x="1" y="3" width="15" height="13" rx="1" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M16 8h4l3 3v5h-7V8z" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="5.5" cy="18.5" r="2.5" />
        <circle cx="18.5" cy="18.5" r="2.5" />
      </svg>
    ),
    title: 'Rapid Tracked Delivery',
    subtitle: 'Free on qualifying battery & power orders',
  },
  {
    icon: (
      <svg width="28" height="28" fill="none" stroke="#CC0000" strokeWidth="2" viewBox="0 0 24 24">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M7 11V7a5 5 0 0110 0v4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    title: 'Secure Payment Options',
    subtitle: 'Direct transfer, cards, and payment on delivery',
  },
  {
    icon: (
      <svg width="28" height="28" fill="none" stroke="#CC0000" strokeWidth="2" viewBox="0 0 24 24">
        <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    title: 'Engineered Technical Support',
    subtitle: 'Talk directly to power system specialists',
  },
];

const FeaturesBar: React.FC = () => (
  <section className="border-b border-slate-200 bg-white shadow-xs">
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-slate-100">
        {trustFeatures.map((f, i) => (
          <div key={i} className="flex items-center gap-4 py-6 px-4">
            <div className="shrink-0 p-2.5 rounded-xl bg-red-50 text-[#CC0000]">
              {f.icon}
            </div>
            <div>
              <div className="text-sm font-bold text-slate-900 leading-snug">
                {f.title}
              </div>
              <div className="text-xs text-slate-500 mt-0.5 font-normal">
                {f.subtitle}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default FeaturesBar;
