'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCartStore } from '@/store/cartStore';
import CheckoutForm, { type CheckoutFormData } from '@/components/checkOut/CheckoutForm';
import OrderSummary from '@/components/checkOut/OrderSummary';
import PaymentButton from '@/components/checkOut/PaymentButton';
import { formatPrice } from '@/lib/mock-data';

const colors = {
  primary: '#22C55E',
  secondary: '#0D1B2A',
  white: '#FFFFFF',
  border: '#E5E7EB',
  bgLight: '#F9FAFB',
  textMuted: '#6B7280',
};

const VAT_RATE = 0.075;
const SHIPPING_FEES: Record<string, number> = { standard: 3500, express: 7000, pickup: 0 };

const steps = ['Cart', 'Checkout', 'Confirmation'];

// ── Validation ──
function validate(data: CheckoutFormData): Partial<Record<keyof CheckoutFormData, string>> {
  const errors: Partial<Record<keyof CheckoutFormData, string>> = {};
  if (!data.firstName.trim()) errors.firstName = 'First name is required';
  if (!data.lastName.trim()) errors.lastName = 'Last name is required';
  if (!data.email.trim()) errors.email = 'Email is required';
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) errors.email = 'Invalid email address';
  if (!data.phone.trim()) errors.phone = 'Phone number is required';
  if (!data.address.trim()) errors.address = 'Address is required';
  if (!data.city.trim()) errors.city = 'City is required';
  if (!data.state) errors.state = 'Please select a state';
  return errors;
}

export default function CheckoutPage() {
  const router = useRouter();
  const { items, calculateTotals, clearCart } = useCartStore();
  const { subtotal, discount } = calculateTotals();

  const [formData, setFormData] = useState<CheckoutFormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    deliveryMethod: 'standard',
    paymentMethod: 'paystack',
    notes: '',
  });

  const [errors, setErrors] = useState<Partial<Record<keyof CheckoutFormData, string>>>({});
  const [isLoading, setIsLoading] = useState(false);

  const shipping = subtotal >= 50000 ? 0 : (SHIPPING_FEES[formData.deliveryMethod] ?? 3500);
  const vat = Math.round(subtotal * VAT_RATE);
  const total = subtotal + shipping + vat;

  const handleChange = (field: keyof CheckoutFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const handleSubmit = () => {
    const newErrors = validate(formData);
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setIsLoading(true);
    // Simulate API call — replace with real payment in Week 5
    setTimeout(() => {
      clearCart();
      router.push('/checkout/success');
    }, 2000);
  };

  // Empty cart redirect
  if (items.length === 0) {
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
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <p
            style={{
              fontSize: '18px',
              fontWeight: 700,
              color: colors.secondary,
              margin: '0 0 16px 0',
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
    );
  }

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
            alignItems: 'center',
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

        {/* Step indicator */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0',
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
                  style={{
                    width: '60px',
                    height: '2px',
                    backgroundColor: i === 0 ? colors.primary : colors.border,
                    margin: '0 4px 16px 4px',
                  }}
                />
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Main layout */}
        <div
          className="grid grid-cols-1 lg:grid-cols-3"
          style={{ gap: '24px', alignItems: 'flex-start' }}
        >
          {/* Form — takes 2/3 */}
          <div
            className="lg:col-span-2"
            style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}
          >
            {Object.keys(errors).length > 0 && (
              <div
                style={{
                  padding: '12px 16px',
                  backgroundColor: '#FEF2F2',
                  borderRadius: '8px',
                  border: '1px solid #FECACA',
                }}
              >
                <p style={{ fontSize: '13px', color: '#EF4444', margin: 0, fontWeight: 600 }}>
                  Please fix the errors below before continuing.
                </p>
              </div>
            )}

            <CheckoutForm data={formData} errors={errors} onChange={handleChange} />

            <PaymentButton
              isLoading={isLoading}
              isDisabled={items.length === 0}
              total={total}
              paymentMethod={formData.paymentMethod}
              onSubmit={handleSubmit}
            />
          </div>

          {/* Order summary — 1/3, sticky */}
          <div>
            <OrderSummary deliveryMethod={formData.deliveryMethod} />
          </div>
        </div>
      </div>
    </div>
  );
}
