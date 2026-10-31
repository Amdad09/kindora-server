import {z} from 'zod';
export const createEventsSchema = z.object({
    title: z
        .string()
        .trim()
        .min(5, 'Title must be at least 5 charcters')
        .max(100, 'Title cannot exceed 100 charcters'),
    description: z
        .string()
        .trim()
        .min(20, 'Description must be at least 20 charcters')
        .max(2000, 'Description cannot exceed 2000 charcters'),
    eventType: z.enum([
        'Environment',
        'Charity',
        'Healthcare',
        'Education',
        'Community',
    ]),
    imageUrl: z.url('Please provide a valid image URL'),
    location: z
        .string()
        .trim()
        .min(3, 'Location must be at least 3 characters'),
    eventDate: z.iso.datetime({ message: 'Please provide a valid event date' }),
});
