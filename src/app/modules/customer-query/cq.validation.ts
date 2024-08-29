import { z } from 'zod';

// User schema
const createCqValidationSchema = z.object({
    body: z.object({
        name: z.string({
            required_error: 'Name is required',
            invalid_type_error: 'Name must be a string',
        }),
        email: z.string({
            required_error: 'Email is required',
            invalid_type_error: 'Email must be a string',
        }),
        subject: z.string({
            required_error: 'Subject is required',
            invalid_type_error: 'Subject must be a string',
        }),
        query: z.string({
            required_error: 'query is required',
            invalid_type_error: 'Query must be a string',
        }),
    }),
});

const updateQcValidationSchema = z.object({
    body: z.object({
        name: z.string().optional(),
        email: z.string().optional(),
        subject: z.string().optional(),
        query: z.string().optional(),
        isAnswered: z.boolean().optional(),
    }),
});

export const cqValidations = {
    createCqValidationSchema,
    updateQcValidationSchema,
};
