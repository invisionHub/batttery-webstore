'use client';

import { useCartStore } from '@/store';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export const useCheckOut = () => {
  const router = useRouter();
  const { items, calculateTotals, clearCart } = useCartStore();
  const { subtotal } = calculateTotals();
  const [isLoading, setIsLoading] = useState(false);

  return {
    items,
    subtotal,
    isLoading,
    setIsLoading,
    clearCart,
    router,
  };
};
