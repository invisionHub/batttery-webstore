import { z } from 'zod';

export const contactSubjectValues = [
    'general',
    'order',
    'installation',
    'warranty',
    'partnership',
] as const;

export const contactSchema = z.object({
    name: z
        .string()
        .trim()
        .min(2, 'Full name must be at least 2 characters.')
        .max(80, 'Full name is too long.'),

    email: z.string().trim().email('Please enter a valid email address.'),

    phone: z
        .string()
        .trim()
        .min(8, 'Please enter a valid phone number.')
        .max(18, 'Please enter a valid phone number.')
        .refine((value) => /^\+?[0-9\s()-]{8,18}$/.test(value), 'Please enter a valid phone number.'),

    subject: z.enum(contactSubjectValues, {
        message: 'Please choose a valid subject.',
    }),

    message: z
        .string()
        .trim()
        .min(10, 'Message must be at least 10 characters.')
        .max(1000, 'Message must be 1000 characters or less.'),
});

export type ContactFormData = z.infer<typeof contactSchema>;

export const contactDefaultValues: ContactFormData = {
    name: '',
    email: '',
    phone: '',
    subject: 'general',
    message: '',
};
