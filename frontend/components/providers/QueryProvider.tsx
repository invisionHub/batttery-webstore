'use client';

import React from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { queryClient } from '@/lib/queryClient';

// ============================================
// QUERY PROVIDER
// Wraps the entire app with TanStack Query context
// Add this to your root layout.tsx
// ============================================
interface QueryProviderProps {
  children: React.ReactNode;
}

const QueryProvider: React.FC<QueryProviderProps> = ({ children }) => {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {/* DevTools only shows in development — auto-hidden in production */}
      <ReactQueryDevtools initialIsOpen={false} buttonPosition="bottom-left" />
    </QueryClientProvider>
  );
};

export default QueryProvider;

// --- USAGE in layout.tsx ---
//
// import QueryProvider from "@/components/providers/QueryProvider";
//
// export default function RootLayout({ children }) {
//   return (
//     <html lang="en">
//       <body>
//         <QueryProvider>
//           <Header />
//           <main>{children}</main>
//           <Footer />
//         </QueryProvider>
//       </body>
//     </html>
//   );
// }
