import { ReactNode } from 'react';

interface IProductLayoutProps {
  SiderBar: React.JSX.Element;
  children: ReactNode;
}

const colors = {
  primary: '#CC0000',
  secondary: '#0D1B2A',
  white: '#FFFFFF',
  border: '#E5E7EB',
  bgLight: '#F9FAFB',
  textMuted: '#6B7280',
  error: '#EF4444',
  errorBg: '#FEF2F2',
  errorBorder: '#FECACA',
};

export const ProductLayout = ({ ...productLayoutProps }: IProductLayoutProps) => {
  const { SiderBar, children } = productLayoutProps;
  return (
    <div>
      <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
        <div className="hidden lg:block" style={{ width: '220px', flexShrink: 0 }}>
          {SiderBar}
        </div>

        <div style={{ flex: 1, minWidth: 0 }} className="flex flex-col">
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '12px',
              marginBottom: '16px',
              padding: '10px 14px',
              backgroundColor: colors.white,
              borderRadius: '10px',
              border: `1px solid ${colors.border}`,
            }}
          >
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};
