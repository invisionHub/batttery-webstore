import React from 'react';

const colors = {
  primary: '#facc15',
  secondary: '#1f2937',
  text: '#ffffff',
};

export default function NewsletterCTA() {
  return (
    <section className="bg-gray-100 py-16">
      <div className="max-w-3xl mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold mb-4">Join the Power Club</h2>
        <p className="text-gray-600 mb-8">
          Get exclusive deals, early access to new products, and battery maintenance tips delivered
          to your inbox.
        </p>
        <form className="flex flex-col sm:flex-row gap-3">
          <input
            type="email"
            placeholder="Enter your email address"
            className="flex-1 px-6 py-4 rounded-full border-none focus:ring-2 focus:ring-yellow-400 outline-none"
          />
          <button
            className="px-10 py-4 rounded-full font-bold shadow-lg shadow-yellow-400/20 hover:shadow-yellow-400/40 transition-all"
            style={{ backgroundColor: colors.primary, color: colors.secondary }}
          >
            SUBSCRIBE
          </button>
        </form>
      </div>
    </section>
  );
}
