import type { Metadata } from 'next';
import './globals.css';

import Footer from '@/components/layout/Footer';
import { Header } from '@/components/layout';

export const metadata: Metadata = {
  title: 'JavaL — Light & Plug Concept',
  description: 'Premium electrical products — lights, plugs, appliances and everything in between.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, padding: 0, backgroundColor: '#F9FAFB' }}>
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
