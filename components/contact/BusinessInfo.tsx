import React from 'react';

const colors = {
  primary: '#CC0000',
  secondary: '#0D1B2A',
  white: '#FFFFFF',
  border: '#E5E7EB',
  bgLight: '#F9FAFB',
  textMuted: '#6B7280',
};

const infoItems = [
  {
    icon: (
      <svg
        width="18"
        height="18"
        fill="none"
        stroke={colors.primary}
        strokeWidth="2"
        viewBox="0 0 24 24"
      >
        <path
          d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-3.07-8.67A2 2 0 012 1h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 8.91a16 16 0 006.18 6.18l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    label: 'Phone',
    value: '+234 000 000 034',
    href: 'tel:+234000000034',
  },
  {
    icon: (
      <svg
        width="18"
        height="18"
        fill="none"
        stroke={colors.primary}
        strokeWidth="2"
        viewBox="0 0 24 24"
      >
        <path
          d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <polyline points="22,6 12,13 2,6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    label: 'Email',
    value: 'hello@javal.ng',
    href: 'mailto:hello@javal.ng',
  },
  {
    icon: (
      <svg
        width="18"
        height="18"
        fill="none"
        stroke={colors.primary}
        strokeWidth="2"
        viewBox="0 0 24 24"
      >
        <path
          d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="12" cy="10" r="3" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    label: 'Address',
    value: '12 Adeola Odeku Street, Victoria Island, Lagos',
    href: null,
  },
  {
    icon: (
      <svg
        width="18"
        height="18"
        fill="none"
        stroke={colors.primary}
        strokeWidth="2"
        viewBox="0 0 24 24"
      >
        <circle cx="12" cy="12" r="10" strokeLinecap="round" strokeLinejoin="round" />
        <polyline points="12 6 12 12 16 14" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    label: 'Business Hours',
    value: 'Mon – Sat: 8:00 AM – 6:00 PM',
    href: null,
  },
];

const BusinessInfo: React.FC = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
    {/* Contact details card */}
    <div
      style={{
        backgroundColor: colors.white,
        borderRadius: '12px',
        border: `1px solid ${colors.border}`,
        padding: '24px',
      }}
    >
      <h2
        style={{ fontSize: '18px', fontWeight: 800, color: colors.secondary, margin: '0 0 4px 0' }}
      >
        Contact Information
      </h2>
      <p style={{ fontSize: '13px', color: colors.textMuted, margin: '0 0 20px 0' }}>
        Reach out to us directly through any of these channels.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
        {infoItems.map((item) => (
          <div key={item.label} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                backgroundColor: colors.bgLight,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              {item.icon}
            </div>
            <div>
              <p
                style={{
                  fontSize: '11px',
                  color: colors.textMuted,
                  margin: 0,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                }}
              >
                {item.label}
              </p>
              {item.href ? (
                <a
                  href={item.href}
                  style={{
                    fontSize: '14px',
                    fontWeight: 600,
                    color: colors.secondary,
                    textDecoration: 'none',
                  }}
                >
                  {item.value}
                </a>
              ) : (
                <p
                  style={{ fontSize: '14px', fontWeight: 600, color: colors.secondary, margin: 0 }}
                >
                  {item.value}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>

    {/* Map placeholder */}
    <div
      style={{
        backgroundColor: colors.white,
        borderRadius: '12px',
        border: `1px solid ${colors.border}`,
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          height: '200px',
          backgroundColor: colors.bgLight,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
        }}
      >
        <svg
          width="32"
          height="32"
          fill="none"
          stroke={colors.textMuted}
          strokeWidth="1.5"
          viewBox="0 0 24 24"
        >
          <path
            d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="12" cy="10" r="3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <p style={{ fontSize: '12px', color: colors.textMuted, margin: 0 }}>Find Our Showroom</p>
      </div>
    </div>
  </div>
);

export default BusinessInfo;
