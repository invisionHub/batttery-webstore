import React from 'react';

const colors = {
  secondary: '#0D1B2A',
  white: '#FFFFFF',
  whatsapp: '#25D366',
  whatsappHover: '#1DA851',
  textMuted: '#94A3B8',
};

interface WhatsAppCTAProps {
  phoneNumber?: string;
  message?: string;
}

const WhatsAppCTA: React.FC<WhatsAppCTAProps> = ({
  phoneNumber = '234000000034',
  message = "Hi JavaL, I'd like to ask about your products.",
}) => {
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

  return (
    <div
      style={{
        backgroundColor: colors.secondary,
        borderRadius: '12px',
        padding: '24px',
        textAlign: 'center',
      }}
    >
      <div
        style={{
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          backgroundColor: colors.whatsapp,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 14px auto',
        }}
      >
        <svg width="28" height="28" fill={colors.white} viewBox="0 0 24 24">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
          <path d="M12 0C5.373 0 0 5.373 0 12c0 2.124.558 4.117 1.533 5.845L.057 23.428a.5.5 0 00.609.61l5.703-1.485A11.945 11.945 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.9 0-3.676-.524-5.198-1.432l-.374-.22-3.878 1.01 1.028-3.768-.242-.386A9.96 9.96 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z" />
        </svg>
      </div>
      <h3 style={{ fontSize: '16px', fontWeight: 800, color: colors.white, margin: '0 0 6px 0' }}>
        Chat With Us on WhatsApp
      </h3>
      <p
        style={{ fontSize: '13px', color: colors.textMuted, margin: '0 0 18px 0', lineHeight: 1.6 }}
      >
        Get instant answers to your questions. We typically reply within minutes.
      </p>
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          padding: '12px 28px',
          borderRadius: '8px',
          backgroundColor: colors.whatsapp,
          color: colors.white,
          fontSize: '14px',
          fontWeight: 700,
          textDecoration: 'none',
          transition: 'background-color 0.2s',
        }}
        onMouseEnter={(e) =>
          ((e.currentTarget as HTMLAnchorElement).style.backgroundColor = colors.whatsappHover)
        }
        onMouseLeave={(e) =>
          ((e.currentTarget as HTMLAnchorElement).style.backgroundColor = colors.whatsapp)
        }
      >
        <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
        </svg>
        Start Chat
      </a>
    </div>
  );
};

export default WhatsAppCTA;
