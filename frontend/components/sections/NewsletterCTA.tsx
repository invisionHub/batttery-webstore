'use client';

import React, { useState } from 'react';

const colors = {
  primary: '#22C55E',
  primaryHover: '#16A34A',
  secondary: '#0D1B2A',
  white: '#FFFFFF',
  textMuted: '#94A3B8',
};

const NewsletterCTA: React.FC = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 1200);
  };

  return (
    <section style={{ backgroundColor: '#111F2E', paddingTop: '64px', paddingBottom: '64px' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className="flex flex-col items-center text-center gap-5"
          style={{ maxWidth: '560px', margin: '0 auto' }}
        >
          <span
            style={{
              fontSize: '11px',
              fontWeight: 700,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              backgroundColor: 'rgba(34,197,94,0.12)',
              color: colors.primary,
              padding: '4px 12px',
              borderRadius: '999px',
            }}
          >
            Stay Updated
          </span>
          <h2
            style={{
              fontSize: 'clamp(1.8rem, 4vw, 2.5rem)',
              fontWeight: 900,
              color: colors.white,
              lineHeight: 1.15,
              margin: 0,
            }}
          >
            Join the <span style={{ color: colors.primary }}>Javal Community</span>
          </h2>
          <p style={{ fontSize: '14px', color: colors.textMuted, lineHeight: 1.7, margin: 0 }}>
            Get exclusive deals, new product alerts, and expert electrical tips delivered straight
            to your inbox.
          </p>

          {submitted ? (
            <div className="flex flex-col items-center gap-3">
              <div
                className="w-14 h-14 rounded-full flex items-center justify-center"
                style={{ backgroundColor: 'rgba(34,197,94,0.12)' }}
              >
                <svg width="28" height="28" fill="none" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10" fill={colors.primary} />
                  <path
                    d="M8 12l3 3 5-5"
                    stroke={colors.white}
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <p style={{ fontWeight: 700, color: colors.white, fontSize: '16px', margin: 0 }}>
                You are in! Welcome to the community.
              </p>
              <p style={{ fontSize: '13px', color: colors.textMuted, margin: 0 }}>
                Check your inbox for a confirmation email.
              </p>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="flex flex-col sm:flex-row gap-3 w-full"
              style={{ maxWidth: '440px' }}
            >
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                required
                style={{
                  flex: 1,
                  padding: '12px 16px',
                  borderRadius: '8px',
                  border: '1px solid rgba(255,255,255,0.12)',
                  backgroundColor: 'rgba(255,255,255,0.07)',
                  color: colors.white,
                  fontSize: '14px',
                  outline: 'none',
                }}
              />
              <button
                type="submit"
                disabled={loading}
                style={{
                  padding: '12px 24px',
                  borderRadius: '8px',
                  backgroundColor: loading ? colors.primaryHover : colors.primary,
                  color: colors.white,
                  fontWeight: 700,
                  fontSize: '14px',
                  border: 'none',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  flexShrink: 0,
                  transition: 'background-color 0.2s',
                }}
              >
                {loading ? 'Subscribing...' : 'Subscribe'}
              </button>
            </form>
          )}
          {!submitted && (
            <p style={{ fontSize: '12px', color: colors.textMuted, margin: 0 }}>
              No spam. Unsubscribe anytime.
            </p>
          )}
        </div>
      </div>
    </section>
  );
};

export default NewsletterCTA;
