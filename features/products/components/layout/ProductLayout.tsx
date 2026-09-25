import { ReactNode } from 'react';

interface IProductLayoutProps {
  SiderBar: React.JSX.Element;
  children: ReactNode;
}

export const ProductLayout = ({ SiderBar, children }: IProductLayoutProps) => {
  return (
    <div className="w-full">
      <div className="flex flex-col lg:flex-row gap-6 items-start">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:block w-64 shrink-0 sticky top-24">
          {SiderBar}
        </aside>

        {/* Product Grid Area */}
        <main className="w-full flex-1 min-w-0">
          {children}
        </main>
      </div>
    </div>
  );
};
