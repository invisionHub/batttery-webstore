'use client';

import React from 'react';
import Link from 'next/link';
import ContactForm from '@/components/contact/ContactForm';
import BusinessInfo from '@/components/contact/BusinessInfo';
import WhatsAppCTA from '@/components/contact/WhatsAppCTA';

const colors = {
  primary: '#CC0000',
  secondary: '#0D1B2A',
  white: '#FFFFFF',
  border: '#E5E7EB',
  bgLight: '#F9FAFB',
  textMuted: '#6B7280',
};

export default function ContactPage() {
  return (
    <div style={{ backgroundColor: colors.bgLight, minHeight: '100vh' }}>
      <div style={{ backgroundColor: colors.secondary, padding: '48px 0' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" style={{ textAlign: 'center' }}>
          <h1
            style={{
              fontSize: 'clamp(28px, 4vw, 40px)',
              fontWeight: 900,
              color: colors.white,
              margin: '0 0 10px 0',
            }}
          >
            Get in Touch
          </h1>
          <p
            style={{
              fontSize: '14px',
              color: '#94A3B8',
              margin: 0,
              maxWidth: '480px',
              marginLeft: 'auto',
              marginRight: 'auto',
            }}
          >
            Have a question about our products or need help with an order? We are here to help.
          </p>
        </div>
      </div>

      <div
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
        style={{ paddingTop: '24px', paddingBottom: '56px' }}
      >
        <nav
          style={{
            display: 'flex',
            gap: '6px',
            fontSize: '12px',
            color: colors.textMuted,
            marginBottom: '24px',
          }}
        >
          <Link href="/" style={{ color: colors.textMuted, textDecoration: 'none' }}>
            Home
          </Link>
          <span>/</span>
          <span style={{ color: colors.secondary, fontWeight: 600 }}>Contact</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3" style={{ gap: '24px' }}>
          <div className="lg:col-span-2">
            <ContactForm />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <WhatsAppCTA />
            <BusinessInfo />
          </div>
        </div>
      </div>
    </div>
  );
}
