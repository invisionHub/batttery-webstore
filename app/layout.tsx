import type { Metadata } from 'next';
import './globals.css';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/Footer';
import QueryProvider from '@/components/providers/QueryProvider';

export const metadata: Metadata = {
  title: 'Battery Store & Electrical — Certified High-Capacity Power Systems',
  description: 'Certified lithium LiFePO4 batteries, hybrid inverters, circuit breakers, and power distribution systems with 2-year direct warranty and nationwide dispatch.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-50 text-slate-900 antialiased font-sans selection:bg-red-500 selection:text-white">
        <QueryProvider>
          <Header />
          <main>{children}</main>
          <Footer />
        </QueryProvider>
      </body>
    </html>
  );
}
