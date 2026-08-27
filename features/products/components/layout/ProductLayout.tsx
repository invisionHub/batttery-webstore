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
    <div className="">
      <div className="flex gap-3">
        <div className="hidden lg:block" style={{ width: '220px', flexShrink: 0 }}>
          {SiderBar}
        </div>
        <div className="w-full">
          <div
            className={`flex items-center justify-between gap-3 mb-4 ml-6 mr-6 pt-2 pb-3.5 pl-3 pr-3 rounded-[10px] bg-[${colors.white}] border-s-0  border-[${colors.border}]`}
          >
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};
