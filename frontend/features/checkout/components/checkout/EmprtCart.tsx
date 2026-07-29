"use client"

import { colors } from '@/constants/theme'
import Link from 'next/link'

export const EmprtCart = () => {
  return (
     <div
        style={{
          backgroundColor: colors.bgLight,
          minHeight: '60vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div style={{ textAlign: 'center' }}>
          <p
            style={{
              fontSize: '18px',
              fontWeight: 700,
              color: colors.secondary,
              marginBottom: '16px',
            }}
          >
            Your cart is empty
          </p>
          <Link
            href="/products"
            style={{
              padding: '10px 24px',
              borderRadius: '8px',
              backgroundColor: colors.primary,
              color: colors.white,
              fontSize: '14px',
              fontWeight: 700,
              textDecoration: 'none',
            }}
          >
            Shop Now
          </Link>
        </div>
      </div>
  )
}

