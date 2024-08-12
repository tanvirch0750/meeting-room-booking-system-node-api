import { z } from 'zod';

const dateStringSchema = z.string().refine(
    (date) => {
        const regex = /^\d{4}-\d{2}-\d{2}$/; // Matches "YYYY-MM-DD"
        return regex.test(date);
    },
    {
        message: 'Invalid date format, expected "YYYY-MM-DD".',
    },
);

// User schema
const createBookingValidationSchema = z.object({
    body: z.object({
        date: dateStringSchema,
        room: z.string({
            required_error: 'Room Id is required',
            invalid_type_error: 'Room id must be a string',
        }),

        user: z.string({
            required_error: 'User Id is required',
            invalid_type_error: 'User id must be a string',
        }),

        slots: z
            .array(z.string(), {
                required_error: 'Slot Ids are required',
                invalid_type_error: 'Slot must be an array of slot ids',
            })
            .min(1, 'At least one slot is required'),
    }),
});

const updateBookinglidationSchema = z.object({
    body: z.object({
        date: dateStringSchema.optional(),
        room: z.string().optional(),
        user: z.string().optional(),
        slots: z.array(z.string()).optional(),
    }),
});

export const bookingValidations = {
    createBookingValidationSchema,
    updateBookinglidationSchema,
};
