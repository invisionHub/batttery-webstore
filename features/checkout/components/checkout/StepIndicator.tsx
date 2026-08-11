"use client"

import { colors } from '@/constants/theme'
import React from 'react'

export const StepIndicator = ({steps}:{steps:string[]}) => {
  return (
      <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '28px',
          }}
        >
          {steps.map((step, i) => (
            <React.Fragment key={step}>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    backgroundColor: i <= 1 ? colors.primary : colors.border,
                    color: i <= 1 ? colors.white : colors.textMuted,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '12px',
                    fontWeight: 700,
                  }}
                >
                  {i === 0 ? '✓' : i + 1}
                </div>
                <span
                  style={{
                    fontSize: '11px',
                    fontWeight: i === 1 ? 700 : 400,
                    color: i === 1 ? colors.secondary : colors.textMuted,
                  }}
                >
                  {step}
                </span>
              </div>
              {i < steps.length - 1 && (
                <div
                  className="w-8 sm:w-16"
                  style={{
                    height: '2px',
                    backgroundColor: i === 0 ? colors.primary : colors.border,
                    margin: '0 4px 16px 4px',
                  }}
                />
              )}
            </React.Fragment>
          ))}
        </div>
  )
}


