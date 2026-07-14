import { z } from 'zod';

const nigerianPhone = z
  .string()
  .min(1, 'Phone number is required')
  .regex(/^(\+?234|0)[789][01]\d{8}$/, 'Enter a valid Nigerian phone number');

export const contactSchema = z.object({
  name: z
    .string()
    .min(1, 'Full name is required')
    .min(2, 'Name must be at least 2 characters')
    .max(80, 'Name is too long')
    .regex(/^[a-zA-Z\s'-]+$/, 'Name can only contain letters'),

  email: z.string().min(1, 'Email address is required').email('Enter a valid email address'),

  phone: nigerianPhone,

  subject: z.enum(['general', 'order', 'installation', 'warranty', 'partnership'], {
    error: 'Please select a subject',
  }),

  message: z
    .string()
    .min(1, 'Message is required')
    .min(10, 'Message must be at least 10 characters')
    .max(1000, 'Message cannot exceed 1000 characters'),
});

export type ContactFormData = z.infer<typeof contactSchema>;

export const contactDefaultValues: ContactFormData = {
  name: '',
  email: '',
  phone: '',
  subject: 'general',
  message: '',
};
