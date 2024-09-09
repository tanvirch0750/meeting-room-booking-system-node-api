import { z } from 'zod';

// User schema
const createCqValidationSchema = z.object({
    body: z.object({
        firstName: z.string({
            required_error: 'First Name is required',
            invalid_type_error: 'First Name must be a string',
        }),
        lastName: z.string({
            required_error: 'Last Name is required',
            invalid_type_error: 'Last Name must be a string',
        }),
        email: z.string({
            required_error: 'Email is required',
            invalid_type_error: 'Email must be a string',
        }),
        subject: z.string({
            required_error: 'Subject is required',
            invalid_type_error: 'Subject must be a string',
        }),
        message: z.string({
            required_error: 'Message is required',
            invalid_type_error: 'Message must be a string',
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
