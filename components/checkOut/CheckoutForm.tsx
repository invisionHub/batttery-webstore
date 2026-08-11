'use client';

import React from 'react';
import { useFormContext } from 'react-hook-form';
import type { CheckoutFormData } from '@/schemas/checkoutSchema';

// ============================================
// BRAND COLORS — change these to update theme
// ============================================
const colors = {
  primary: '#CC0000',
  secondary: '#0D1B2A',
  white: '#FFFFFF',
  border: '#E5E7EB',
  bgLight: '#F9FAFB',
  textMuted: '#6B7280',
  error: '#EF4444',
  errorBg: '#FEF2F2',
};

const nigerianStates = [
  'Abia',
  'Adamawa',
  'Akwa Ibom',
  'Anambra',
  'Bauchi',
  'Bayelsa',
  'Benue',
  'Borno',
  'Cross River',
  'Delta',
  'Ebonyi',
  'Edo',
  'Ekiti',
  'Enugu',
  'FCT',
  'Gombe',
  'Imo',
  'Jigawa',
  'Kaduna',
  'Kano',
  'Katsina',
  'Kebbi',
  'Kogi',
  'Kwara',
  'Lagos',
  'Nasarawa',
  'Niger',
  'Ogun',
  'Ondo',
  'Osun',
  'Oyo',
  'Plateau',
  'Rivers',
  'Sokoto',
  'Taraba',
  'Yobe',
  'Zamfara',
];

// ─────────────────────────────────────────
// REUSABLE FIELD WRAPPER
// ─────────────────────────────────────────
const Field = ({
  label,
  error,
  required,
  children,
}: {
  label: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
}) => (
  <div>
    <label
      style={{
        fontSize: '12px',
        fontWeight: 600,
        color: colors.secondary,
        display: 'block',
        marginBottom: '6px',
      }}
    >
      {label}
      {required && <span style={{ color: colors.primary, marginLeft: '3px' }}>*</span>}
    </label>
    {children}
    {error && (
      <p
        style={{
          fontSize: '11px',
          color: colors.error,
          margin: '4px 0 0 0',
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
        }}
      >
        <svg width="11" height="11" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
            clipRule="evenodd"
          />
        </svg>
        {error}
      </p>
    )}
  </div>
);

// ─────────────────────────────────────────
// INPUT STYLE HELPER
// ─────────────────────────────────────────
const inputStyle = (hasError: boolean): React.CSSProperties => ({
  width: '100%',
  padding: '10px 12px',
  fontSize: '13px',
  border: `1px solid ${hasError ? colors.error : colors.border}`,
  borderRadius: '8px',
  color: colors.secondary,
  outline: 'none',
  backgroundColor: colors.white,
  boxSizing: 'border-box',
  transition: 'border-color 0.15s',
});

// ─────────────────────────────────────────
// SECTION HEADER
// ─────────────────────────────────────────
const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <div style={{ marginBottom: '16px' }}>
    <h3 style={{ fontSize: '15px', fontWeight: 800, color: colors.secondary, margin: '0 0 6px 0' }}>
      {children}
    </h3>
    <div
      style={{ height: '2px', width: '32px', backgroundColor: colors.primary, borderRadius: '1px' }}
    />
  </div>
);

// ─────────────────────────────────────────
// CHECKOUT FORM — uses React Hook Form context
// ─────────────────────────────────────────
const CheckoutForm: React.FC = () => {
  const {
    register,
    watch,
    formState: { errors },
  } = useFormContext<CheckoutFormData>();

  const deliveryMethod = watch('deliveryMethod');
  const paymentMethod = watch('paymentMethod');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* ── Personal Information ── */}
      <section
        style={{
          backgroundColor: colors.white,
          borderRadius: '12px',
          border: `1px solid ${colors.border}`,
          padding: '20px',
        }}
      >
        <SectionTitle>Personal Information</SectionTitle>
        <div className="grid grid-cols-1 sm:grid-cols-2" style={{ gap: '14px' }}>
          <Field label="First Name" error={errors.firstName?.message} required>
            <input
              {...register('firstName')}
              type="text"
              placeholder="John"
              style={inputStyle(!!errors.firstName)}
              onFocus={(e) => {
                if (!errors.firstName)
                  (e.target as HTMLInputElement).style.borderColor = colors.primary;
              }}
              onBlur={(e) => {
                if (!errors.firstName)
                  (e.target as HTMLInputElement).style.borderColor = colors.border;
              }}
            />
          </Field>

          <Field label="Last Name" error={errors.lastName?.message} required>
            <input
              {...register('lastName')}
              type="text"
              placeholder="Doe"
              style={inputStyle(!!errors.lastName)}
              onFocus={(e) => {
                if (!errors.lastName)
                  (e.target as HTMLInputElement).style.borderColor = colors.primary;
              }}
              onBlur={(e) => {
                if (!errors.lastName)
                  (e.target as HTMLInputElement).style.borderColor = colors.border;
              }}
            />
          </Field>

          <Field label="Email Address" error={errors.email?.message} required>
            <input
              {...register('email')}
              type="email"
              placeholder="john@example.com"
              style={inputStyle(!!errors.email)}
              onFocus={(e) => {
                if (!errors.email)
                  (e.target as HTMLInputElement).style.borderColor = colors.primary;
              }}
              onBlur={(e) => {
                if (!errors.email) (e.target as HTMLInputElement).style.borderColor = colors.border;
              }}
            />
          </Field>

          <Field label="Phone Number" error={errors.phone?.message} required>
            <input
              {...register('phone')}
              type="tel"
              placeholder="08012345678"
              style={inputStyle(!!errors.phone)}
              onFocus={(e) => {
                if (!errors.phone)
                  (e.target as HTMLInputElement).style.borderColor = colors.primary;
              }}
              onBlur={(e) => {
                if (!errors.phone) (e.target as HTMLInputElement).style.borderColor = colors.border;
              }}
            />
          </Field>
        </div>
      </section>

      {/* ── Delivery Address ── */}
      <section
        style={{
          backgroundColor: colors.white,
          borderRadius: '12px',
          border: `1px solid ${colors.border}`,
          padding: '20px',
        }}
      >
        <SectionTitle>Delivery Address</SectionTitle>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <Field label="Street Address" error={errors.address?.message} required>
            <input
              {...register('address')}
              type="text"
              placeholder="12 Adeola Odeku Street, Victoria Island"
              style={inputStyle(!!errors.address)}
              onFocus={(e) => {
                if (!errors.address)
                  (e.target as HTMLInputElement).style.borderColor = colors.primary;
              }}
              onBlur={(e) => {
                if (!errors.address)
                  (e.target as HTMLInputElement).style.borderColor = colors.border;
              }}
            />
          </Field>

          <div className="grid grid-cols-1 sm:grid-cols-2" style={{ gap: '14px' }}>
            <Field label="City" error={errors.city?.message} required>
              <input
                {...register('city')}
                type="text"
                placeholder="Lagos"
                style={inputStyle(!!errors.city)}
                onFocus={(e) => {
                  if (!errors.city)
                    (e.target as HTMLInputElement).style.borderColor = colors.primary;
                }}
                onBlur={(e) => {
                  if (!errors.city)
                    (e.target as HTMLInputElement).style.borderColor = colors.border;
                }}
              />
            </Field>

            <Field label="State" error={errors.state?.message} required>
              <div style={{ position: 'relative' }}>
                <select
                  {...register('state')}
                  style={{
                    ...inputStyle(!!errors.state),
                    appearance: 'none',
                    paddingRight: '32px',
                    cursor: 'pointer',
                  }}
                >
                  <option value="">Select state</option>
                  {nigerianStates.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
                <span
                  style={{
                    position: 'absolute',
                    right: '10px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    pointerEvents: 'none',
                    color: colors.textMuted,
                  }}
                >
                  <svg
                    width="12"
                    height="12"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    viewBox="0 0 24 24"
                  >
                    <path d="M19 9l-7 7-7-7" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              </div>
            </Field>
          </div>
        </div>
      </section>

      {/* ── Delivery Method ── */}
      <section
        style={{
          backgroundColor: colors.white,
          borderRadius: '12px',
          border: `1px solid ${colors.border}`,
          padding: '20px',
        }}
      >
        <SectionTitle>Delivery Method</SectionTitle>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {[
            {
              value: 'standard',
              label: 'Standard Delivery',
              desc: '3–5 business days',
              price: '₦3,500',
            },
            {
              value: 'express',
              label: 'Express Delivery',
              desc: 'Next business day',
              price: '₦7,000',
            },
            {
              value: 'pickup',
              label: 'Store Pickup',
              desc: 'Pick up from our Lagos store',
              price: 'FREE',
            },
          ].map((opt) => (
            <label
              key={opt.value}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 14px',
                borderRadius: '8px',
                cursor: 'pointer',
                border: `1.5px solid ${deliveryMethod === opt.value ? colors.primary : colors.border}`,
                backgroundColor: deliveryMethod === opt.value ? '#F0FDF4' : colors.white,
              }}
            >
              <input
                {...register('deliveryMethod')}
                type="radio"
                value={opt.value}
                style={{ display: 'none' }}
              />
              <div
                style={{
                  width: '18px',
                  height: '18px',
                  borderRadius: '50%',
                  flexShrink: 0,
                  border: `2px solid ${deliveryMethod === opt.value ? colors.primary : colors.border}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {deliveryMethod === opt.value && (
                  <div
                    style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      backgroundColor: colors.primary,
                    }}
                  />
                )}
              </div>
              <div style={{ flex: 1 }}>
                <p
                  style={{ fontSize: '13px', fontWeight: 700, color: colors.secondary, margin: 0 }}
                >
                  {opt.label}
                </p>
                <p style={{ fontSize: '12px', color: colors.textMuted, margin: 0 }}>{opt.desc}</p>
              </div>
              <span
                style={{
                  fontSize: '13px',
                  fontWeight: 700,
                  color: deliveryMethod === opt.value ? colors.primary : colors.secondary,
                }}
              >
                {opt.price}
              </span>
            </label>
          ))}
        </div>
      </section>

      {/* ── Payment Method ── */}
      <section
        style={{
          backgroundColor: colors.white,
          borderRadius: '12px',
          border: `1px solid ${colors.border}`,
          padding: '20px',
        }}
      >
        <SectionTitle>Payment Method</SectionTitle>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {[
            {
              value: 'card',
              label: 'Pay with Card',
              desc: 'Visa, Mastercard, Verve via Paystack',
            },
            {
              value: 'bank_transfer',
              label: 'Pay with Bank Transfer',
              desc: 'Generate a Paystack transfer account and complete payment securely',
            },
            {
              value: 'ussd',
              label: 'Pay with USSD',
              desc: 'Use your bank USSD prompt through Paystack',
            },
          ].map((opt) => (
            <label
              key={opt.value}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 14px',
                borderRadius: '8px',
                cursor: 'pointer',
                border: `1.5px solid ${paymentMethod === opt.value ? colors.primary : colors.border}`,
                backgroundColor: paymentMethod === opt.value ? '#F0FDF4' : colors.white,
              }}
            >
              <input
                {...register('paymentMethod')}
                type="radio"
                value={opt.value}
                style={{ display: 'none' }}
              />
              <div
                style={{
                  width: '18px',
                  height: '18px',
                  borderRadius: '50%',
                  flexShrink: 0,
                  border: `2px solid ${paymentMethod === opt.value ? colors.primary : colors.border}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {paymentMethod === opt.value && (
                  <div
                    style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      backgroundColor: colors.primary,
                    }}
                  />
                )}
              </div>
              <div>
                <p
                  style={{ fontSize: '13px', fontWeight: 700, color: colors.secondary, margin: 0 }}
                >
                  {opt.label}
                </p>
                <p style={{ fontSize: '12px', color: colors.textMuted, margin: 0 }}>{opt.desc}</p>
              </div>
            </label>
          ))}
        </div>
      </section>

      {/* ── Order Notes ── */}
      <section
        style={{
          backgroundColor: colors.white,
          borderRadius: '12px',
          border: `1px solid ${colors.border}`,
          padding: '20px',
        }}
      >
        <SectionTitle>Order Notes</SectionTitle>
        <Field label="Additional Notes (optional)" error={errors.notes?.message}>
          <textarea
            {...register('notes')}
            placeholder="Any special instructions for delivery?"
            rows={3}
            style={{
              ...inputStyle(!!errors.notes),
              resize: 'vertical',
              minHeight: '80px',
              fontFamily: 'inherit',
            }}
          />
        </Field>
      </section>
    </div>
  );
};

export default CheckoutForm;
