"use client"

import { colors } from "@/constants/theme"
import Link from "next/link"

export const CheckOutLayout = ({children}:{children:React.ReactNode}) => {
  return (
    <div style={{ backgroundColor: colors.bgLight, minHeight: '100vh' }}>
      <div
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
        style={{ paddingTop: '24px', paddingBottom: '56px' }}
      >
        {/* Breadcrumb */}
        <nav
          style={{
            display: 'flex',
            gap: '6px',
            fontSize: '12px',
            color: colors.textMuted,
            marginBottom: '20px',
          }}
        >
          <Link href="/" style={{ color: colors.textMuted, textDecoration: 'none' }}>
            Home
          </Link>
          <span>/</span>
          <Link href="/cart" style={{ color: colors.textMuted, textDecoration: 'none' }}>
            Cart
          </Link>
          <span>/</span>
          <span style={{ color: colors.secondary, fontWeight: 600 }}>Checkout</span>
        </nav>
          {children}
      </div>
    </div>
  )
}

