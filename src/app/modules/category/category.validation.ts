import { z } from 'zod';

// User schema
const createCategoryValidationSchema = z.object({
    body: z.object({
        name: z.string({
            required_error: 'Category name is required',
            invalid_type_error: 'Category name must be a string',
        }),
    }),
});

const updateCategoryValidationSchema = z.object({
    body: z.object({
        name: z.string().optional(),
    }),
});

export const categoryValidations = {
    createCategoryValidationSchema,
    updateCategoryValidationSchema,
};
