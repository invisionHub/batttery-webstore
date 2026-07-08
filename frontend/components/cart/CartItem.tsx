'use client';

import React from 'react';
import { useCartStore, type CartItem as CartItemType } from '@/store/cartStore';
import { formatPrice } from '@/lib/mock-data';

interface CartItemProps {
  item: CartItemType;
}

export default function CartItem({ item }: CartItemProps) {
  const { updateQuantity, removeProduct } = useCartStore();

  return (
    <div
      style={{
        display: 'flex',
        gap: '12px',
        padding: '16px',
        backgroundColor: '#fff',
        border: '1px solid #E5E7EB',
        borderRadius: '12px',
      }}
    >
      <div
        style={{
          width: '72px',
          height: '72px',
          borderRadius: '10px',
          backgroundColor: '#F9FAFB',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        <span style={{ fontSize: '12px', color: '#6B7280', textAlign: 'center' }}>{item.name}</span>
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '8px' }}>
          <div>
            <p style={{ margin: 0, fontWeight: 700, color: '#0D1B2A' }}>{item.name}</p>
            {item.color && (
              <p style={{ margin: '2px 0 0', fontSize: '12px', color: '#6B7280' }}>
                Color: {item.color}
              </p>
            )}
          </div>
          <button
            onClick={() => removeProduct(item.id)}
            style={{
              background: 'none',
              border: 'none',
              color: '#EF4444',
              cursor: 'pointer',
              fontSize: '12px',
            }}
          >
            Remove
          </button>
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '10px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              onClick={() => updateQuantity(item.id, item.quantity - 1)}
              style={{
                width: '28px',
                height: '28px',
                border: '1px solid #E5E7EB',
                borderRadius: '6px',
                background: '#fff',
                cursor: 'pointer',
              }}
            >
              −
            </button>
            <span style={{ minWidth: '24px', textAlign: 'center', fontWeight: 700 }}>
              {item.quantity}
            </span>
            <button
              onClick={() => updateQuantity(item.id, item.quantity + 1)}
              style={{
                width: '28px',
                height: '28px',
                border: '1px solid #E5E7EB',
                borderRadius: '6px',
                background: '#fff',
                cursor: 'pointer',
              }}
            >
              +
            </button>
          </div>
          <span style={{ fontWeight: 700, color: '#0D1B2A' }}>
            {formatPrice(item.price * item.quantity)}
          </span>
        </div>
      </div>
    </div>
  );
}
