'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { contactSchema, contactDefaultValues, type ContactFormData } from '@/schemas/contactSchema';

const colors = {
  primary: '#CC0000',
  primaryHover: '#A30000',
  secondary: '#0D1B2A',
  white: '#FFFFFF',
  border: '#E5E7EB',
  textMuted: '#6B7280',
  error: '#EF4444',
  successBg: '#F0FDF4',
  successBorder: '#BBF7D0',
};

const subjects = [
  { value: 'general', label: 'General Inquiry' },
  { value: 'order', label: 'Order Support' },
  { value: 'installation', label: 'Installation Request' },
  { value: 'warranty', label: 'Warranty Claim' },
  { value: 'partnership', label: 'Partnership / Trade Account' },
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

const ContactForm: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid, isSubmitting },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: contactDefaultValues,
    mode: 'onBlur',
  });

  const onSubmit = handleSubmit(async () => {
    // Simulate API call — replace with real endpoint in Week 5
    await new Promise((res) => setTimeout(res, 1500));
    setSubmitted(true);
    reset();
    setTimeout(() => setSubmitted(false), 5000);
  });

  return (
    <div
      style={{
        backgroundColor: colors.white,
        borderRadius: '12px',
        border: `1px solid ${colors.border}`,
        padding: '24px',
      }}
    >
      <h2
        style={{ fontSize: '18px', fontWeight: 800, color: colors.secondary, margin: '0 0 4px 0' }}
      >
        Send Us a Message
      </h2>
      <p style={{ fontSize: '13px', color: colors.textMuted, margin: '0 0 20px 0' }}>
        We will get back to you within 24 hours.
      </p>

      {submitted && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '12px 14px',
            backgroundColor: colors.successBg,
            border: `1px solid ${colors.successBorder}`,
            borderRadius: '8px',
            marginBottom: '16px',
          }}
        >
          <svg width="18" height="18" fill="none" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10" fill={colors.primary} />
            <path
              d="M8 12l3 3 5-5"
              stroke={colors.white}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <p style={{ fontSize: '13px', fontWeight: 600, color: '#15803D', margin: 0 }}>
            Message sent successfully! We will be in touch soon.
          </p>
        </div>
      )}

      <form onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <Field label="Full Name" error={errors.name?.message} required>
          <input
            {...register('name')}
            type="text"
            placeholder="John Doe"
            style={inputStyle(!!errors.name)}
          />
        </Field>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
          <Field label="Email Address" error={errors.email?.message} required>
            <input
              {...register('email')}
              type="email"
              placeholder="john@example.com"
              style={inputStyle(!!errors.email)}
            />
          </Field>
          <Field label="Phone Number" error={errors.phone?.message} required>
            <input
              {...register('phone')}
              type="tel"
              placeholder="08012345678"
              style={inputStyle(!!errors.phone)}
            />
          </Field>
        </div>

        <Field label="Subject" error={errors.subject?.message} required>
          <div style={{ position: 'relative' }}>
            <select
              {...register('subject')}
              style={{
                ...inputStyle(!!errors.subject),
                appearance: 'none',
                paddingRight: '32px',
                cursor: 'pointer',
              }}
            >
              {subjects.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
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

        <Field label="Message" error={errors.message?.message} required>
          <textarea
            {...register('message')}
            placeholder="How can we help you?"
            rows={5}
            style={{
              ...inputStyle(!!errors.message),
              resize: 'vertical',
              minHeight: '120px',
              fontFamily: 'inherit',
            }}
          />
        </Field>

        <button
          type="submit"
          disabled={!isValid || isSubmitting}
          style={{
            width: '100%',
            padding: '13px',
            borderRadius: '8px',
            border: 'none',
            backgroundColor: !isValid || isSubmitting ? '#9CA3AF' : colors.primary,
            color: colors.white,
            fontSize: '14px',
            fontWeight: 700,
            cursor: !isValid || isSubmitting ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
          }}
        >
          {isSubmitting ? 'Sending...' : 'Send Message'}
        </button>
      </form>
    </div>
  );
};

export default ContactForm;
