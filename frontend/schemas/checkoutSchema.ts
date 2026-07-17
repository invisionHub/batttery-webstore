import { z } from 'zod';

// ============================================
// NIGERIAN PHONE VALIDATION
// Accepts: +2348012345678, 08012345678, 2348012345678
// ============================================
const nigerianPhone = z
  .string()
  .min(1, 'Phone number is required')
  .regex(/^(\+?234|0)[789][01]\d{8}$/, 'Enter a valid Nigerian phone number (e.g. 08012345678)');

// ============================================
// CHECKOUT SCHEMA
// ============================================
export const checkoutSchema = z.object({
  // ── Personal info ──
  firstName: z
    .string()
    .min(1, 'First name is required')
    .min(2, 'First name must be at least 2 characters')
    .max(50, 'First name is too long')
    .regex(/^[a-zA-Z\s'-]+$/, 'First name can only contain letters'),

  lastName: z
    .string()
    .min(1, 'Last name is required')
    .min(2, 'Last name must be at least 2 characters')
    .max(50, 'Last name is too long')
    .regex(/^[a-zA-Z\s'-]+$/, 'Last name can only contain letters'),

  email: z.string().min(1, 'Email address is required').email('Enter a valid email address'),

  phone: nigerianPhone,

  // ── Delivery address ──
  address: z
    .string()
    .min(1, 'Street address is required')
    .min(5, 'Address must be at least 5 characters')
    .max(200, 'Address is too long'),

  city: z
    .string()
    .min(1, 'City is required')
    .min(2, 'City name must be at least 2 characters')
    .max(100, 'City name is too long')
    .regex(/^[a-zA-Z\s'-]+$/, 'City name can only contain letters'),

  state: z.string().min(1, 'Please select a state'),

  // ── Delivery & payment ──
  deliveryMethod: z.enum(['standard', 'express', 'pickup'], {
    error: 'Please select a delivery method',
  }),

  paymentMethod: z.enum(['paystack', 'transfer', 'card'], {
    error: 'Please select a payment method',
  }),

  // ── Optional ──
  notes: z.string().max(500, 'Notes cannot exceed 500 characters').optional(),
});

// Infer TypeScript type from schema
export type CheckoutFormData = z.infer<typeof checkoutSchema>;

// Default values
export const checkoutDefaultValues: CheckoutFormData = {
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
};
