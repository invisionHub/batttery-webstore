"use client"

import { colors } from '@/constants/theme'
import { CheckoutFormData } from '@/schemas/checkoutSchema'
import { FieldErrors } from 'react-hook-form'


interface FormErrorFormatProps {
    errors:FieldErrors<CheckoutFormData>
}
export const FormErrorFormat = ({errors}:FormErrorFormatProps) =>
    Object.keys(errors).length > 0 && (
          <div
            style={{
              padding: '12px 16px',
              backgroundColor: '#FEF2F2',
              borderRadius: '8px',
              border: '1px solid #FECACA',
              marginBottom: '16px',
            }}
          >
            <p style={{ fontSize: '13px', color: colors.error, margin: 0, fontWeight: 600 }}>
              Please fix the errors below before continuing. {errors.root?.message}
            </p>
          </div>
    )
