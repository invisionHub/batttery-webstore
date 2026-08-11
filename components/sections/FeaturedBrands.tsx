import React from 'react';

const colors = {
  text: '#9ca3af', // gray-400
  bg: '#ffffff',
};

const brands = ['Exide', 'Varta', 'Bosch', 'Optima', 'Century', 'Yuasa'];

export default function FeaturedBrands() {
  return (
    <section className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <p className="text-center text-xs font-bold uppercase tracking-widest text-gray-400 mb-8">
          Trusted by World Class Brands
        </p>
        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-50 grayscale hover:grayscale-0 transition-all">
          {brands.map((brand) => (
            <div
              key={brand}
              className="text-2xl font-black italic tracking-tighter"
              style={{ color: '#374151' }}
            >
              {brand}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
