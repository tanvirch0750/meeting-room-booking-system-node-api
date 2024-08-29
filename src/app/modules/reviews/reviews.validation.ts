import { z } from 'zod';

// User schema
const createReviewValidationSchema = z.object({
    body: z.object({
        review: z.string({
            required_error: 'Review is required',
            invalid_type_error: 'Review must be a string',
        }),
        user: z.string({
            required_error: 'User id is required',
            invalid_type_error: 'User must be a string',
        }),
        room: z.string({
            required_error: 'Room id is required',
            invalid_type_error: 'Room must be a string',
        }),
        rating: z.number().optional(),
    }),
});

const updateReviewValidationSchema = z.object({
    body: z.object({
        review: z.string().optional(),
        user: z.string().optional(),
        room: z.string().optional(),
        rating: z.number().optional(),
    }),
});

export const reviewValidations = {
    createReviewValidationSchema,
    updateReviewValidationSchema,
};
