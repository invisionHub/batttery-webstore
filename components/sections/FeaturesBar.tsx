import React from 'react';

const colors = {
  primary: '#22C55E',
  secondary: '#0D1B2A',
  white: '#FFFFFF',
  border: '#E5E7EB',
  textMuted: '#6B7280',
};

const features = [
  {
    icon: (
      <svg
        width="32"
        height="32"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        viewBox="0 0 24 24"
      >
        <rect
          x="1"
          y="3"
          width="15"
          height="13"
          rx="1"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path d="M16 8h4l3 3v5h-7V8z" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="5.5" cy="18.5" r="2.5" />
        <circle cx="18.5" cy="18.5" r="2.5" />
      </svg>
    ),
    title: 'Free Delivery',
    subtitle: 'Within Nigeria',
  },
  {
    icon: (
      <svg
        width="32"
        height="32"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        viewBox="0 0 24 24"
      >
        <rect
          x="5"
          y="2"
          width="14"
          height="20"
          rx="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <line x1="12" y1="18" x2="12.01" y2="18" strokeLinecap="round" />
      </svg>
    ),
    title: 'Give Us a Call',
    subtitle: '+234 000000034',
  },
  {
    icon: (
      <svg
        width="32"
        height="32"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        viewBox="0 0 24 24"
      >
        <path
          d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    title: 'Chat With Us',
    subtitle: 'Live chat Available',
  },
  {
    icon: (
      <svg
        width="32"
        height="32"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        viewBox="0 0 24 24"
      >
        <line x1="12" y1="1" x2="12" y2="23" strokeLinecap="round" />
        <path
          d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    title: 'Best Price',
    subtitle: 'Guaranteed to best price',
  },
];

const FeaturesBar: React.FC = () => (
  <section style={{ backgroundColor: colors.white, borderBottom: `1px solid ${colors.border}` }}>
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-2 md:grid-cols-4">
        {features.map((f, i) => (
          <div
            key={i}
            className="flex items-center gap-4"
            style={{
              padding: '24px 16px',
              borderRight: i < features.length - 1 ? `1px solid ${colors.border}` : 'none',
            }}
          >
            <span style={{ color: colors.primary, flexShrink: 0 }}>{f.icon}</span>
            <div>
              <div
                style={{
                  fontSize: '14px',
                  fontWeight: 700,
                  color: colors.secondary,
                  marginBottom: '2px',
                }}
              >
                {f.title}
              </div>
              <div style={{ fontSize: '12px', color: colors.textMuted }}>{f.subtitle}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default FeaturesBar;
