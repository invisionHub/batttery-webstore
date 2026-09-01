import { z } from 'zod';

export const nigerianStates = [
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
] as const;

export const deliveryMethodOptions = [ 'standard', 'express', 'pickup' ] as const;
export const paymentMethodOptions = [ 'card', 'bank_transfer', 'ussd' ] as const;

const nigerianPhoneRegex = /^(?:\+?234|0)[789]\d{9}$/;

export const checkoutSchema = z.object({
    firstName: z
        .string()
        .trim()
        .min(2, 'First name must be at least 2 characters.')
        .max(50, 'First name is too long.'),
    lastName: z
        .string()
        .trim()
        .min(2, 'Last name must be at least 2 characters.')
        .max(50, 'Last name is too long.'),
    email: z.string().trim().email('Please enter a valid email address.'),
    phone: z
        .string()
        .trim()
        .refine((value) => {
            const normalized = value.replace(/\s+/g, '').replace(/[-()]/g, '');
            return nigerianPhoneRegex.test(normalized);
        }, 'Please enter a valid Nigerian phone number.'),
    address: z
        .string()
        .trim()
        .min(10, 'Please enter your full street address.')
        .max(200, 'Address is too long.'),
    city: z.string().trim().min(2, 'City is required.').max(80, 'City name is too long.'),
    state: z.enum(nigerianStates, { message: 'Please select your state.' }),
    deliveryMethod: z.enum(deliveryMethodOptions, { message: 'Please choose a delivery method.' }),
    paymentMethod: z.enum(paymentMethodOptions, { message: 'Please choose a payment method.' }),
    notes: z.string().trim().max(500, 'Notes must be 500 characters or less.').default(''),
});

export type CheckoutFormData = z.infer<typeof checkoutSchema>;

export const checkoutDefaultValues: CheckoutFormData = {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: 'Lagos',
    deliveryMethod: 'standard',
    paymentMethod: 'card',
    notes: '',
};
