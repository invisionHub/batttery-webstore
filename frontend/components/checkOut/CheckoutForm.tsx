'use client';

import React from 'react';

const colors = {
  primary: '#CC0000',
  secondary: '#0D1B2A',
  white: '#FFFFFF',
  border: '#E5E7EB',
  bgLight: '#F9FAFB',
  textMuted: '#6B7280',
  error: '#EF4444',
};

export interface CheckoutFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  deliveryMethod: 'standard' | 'express' | 'pickup';
  paymentMethod: 'card' | 'transfer' | 'paystack';
  notes: string;
}

interface CheckoutFormProps {
  data: CheckoutFormData;
  errors: Partial<Record<keyof CheckoutFormData, string>>;
  onChange: (field: keyof CheckoutFormData, value: string) => void;
}

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
});

const labelStyle: React.CSSProperties = {
  fontSize: '12px',
  fontWeight: 600,
  color: colors.secondary,
  display: 'block',
  marginBottom: '6px',
};

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
    <label style={labelStyle}>
      {label}
      {required && <span style={{ color: colors.primary, marginLeft: '3px' }}>*</span>}
    </label>
    {children}
    {error && <p style={{ fontSize: '11px', color: colors.error, margin: '4px 0 0 0' }}>{error}</p>}
  </div>
);

const CheckoutForm: React.FC<CheckoutFormProps> = ({ data, errors, onChange }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
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
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
          <Field label="First Name" error={errors.firstName} required>
            <input
              type="text"
              value={data.firstName}
              onChange={(e) => onChange('firstName', e.target.value)}
              placeholder="John"
              style={inputStyle(!!errors.firstName)}
            />
          </Field>
          <Field label="Last Name" error={errors.lastName} required>
            <input
              type="text"
              value={data.lastName}
              onChange={(e) => onChange('lastName', e.target.value)}
              placeholder="Doe"
              style={inputStyle(!!errors.lastName)}
            />
          </Field>
          <Field label="Email Address" error={errors.email} required>
            <input
              type="email"
              value={data.email}
              onChange={(e) => onChange('email', e.target.value)}
              placeholder="john@example.com"
              style={inputStyle(!!errors.email)}
            />
          </Field>
          <Field label="Phone Number" error={errors.phone} required>
            <input
              type="tel"
              value={data.phone}
              onChange={(e) => onChange('phone', e.target.value)}
              placeholder="+234 800 000 0000"
              style={inputStyle(!!errors.phone)}
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
          <Field label="Street Address" error={errors.address} required>
            <input
              type="text"
              value={data.address}
              onChange={(e) => onChange('address', e.target.value)}
              placeholder="12 Adeola Odeku Street"
              style={inputStyle(!!errors.address)}
            />
          </Field>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <Field label="City" error={errors.city} required>
              <input
                type="text"
                value={data.city}
                onChange={(e) => onChange('city', e.target.value)}
                placeholder="Lagos"
                style={inputStyle(!!errors.city)}
              />
            </Field>
            <Field label="State" error={errors.state} required>
              <div style={{ position: 'relative' }}>
                <select
                  value={data.state}
                  onChange={(e) => onChange('state', e.target.value)}
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
                border: `1.5px solid ${data.deliveryMethod === opt.value ? colors.primary : colors.border}`,
                backgroundColor: data.deliveryMethod === opt.value ? '#F0FDF4' : colors.white,
              }}
            >
              <input
                type="radio"
                name="deliveryMethod"
                value={opt.value}
                checked={data.deliveryMethod === opt.value}
                onChange={() => onChange('deliveryMethod', opt.value)}
                style={{ display: 'none' }}
              />
              <div
                style={{
                  width: '18px',
                  height: '18px',
                  borderRadius: '50%',
                  flexShrink: 0,
                  border: `2px solid ${data.deliveryMethod === opt.value ? colors.primary : colors.border}`,
                  backgroundColor: colors.white,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {data.deliveryMethod === opt.value && (
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
                  color: data.deliveryMethod === opt.value ? colors.primary : colors.secondary,
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
            { value: 'paystack', label: 'Pay with Paystack', desc: 'Card, bank transfer, USSD' },
            {
              value: 'transfer',
              label: 'Bank Transfer',
              desc: "Direct bank transfer — we'll confirm manually",
            },
            { value: 'card', label: 'Debit/Credit Card', desc: 'Visa, Mastercard, Verve' },
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
                border: `1.5px solid ${data.paymentMethod === opt.value ? colors.primary : colors.border}`,
                backgroundColor: data.paymentMethod === opt.value ? '#F0FDF4' : colors.white,
              }}
            >
              <input
                type="radio"
                name="paymentMethod"
                value={opt.value}
                checked={data.paymentMethod === opt.value}
                onChange={() => onChange('paymentMethod', opt.value)}
                style={{ display: 'none' }}
              />
              <div
                style={{
                  width: '18px',
                  height: '18px',
                  borderRadius: '50%',
                  flexShrink: 0,
                  border: `2px solid ${data.paymentMethod === opt.value ? colors.primary : colors.border}`,
                  backgroundColor: colors.white,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {data.paymentMethod === opt.value && (
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
        <Field label="Additional Notes (optional)">
          <textarea
            value={data.notes}
            onChange={(e) => onChange('notes', e.target.value)}
            placeholder="Any special instructions for delivery?"
            rows={3}
            style={{
              ...inputStyle(false),
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
