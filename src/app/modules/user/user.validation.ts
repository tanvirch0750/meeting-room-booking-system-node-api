import { z } from 'zod';

// User schema
const createUserValidationSchema = z.object({
    body: z.object({
        name: z
            .string({
                required_error: 'Name name is required',
                invalid_type_error: 'Name must be a string',
            })
            .max(100, { message: 'Name can not be more than 100 characters' })
            .transform((val) => val.trim()),
        password: z
            .string({
                required_error: 'Password is required',
                invalid_type_error: 'Password must be a string',
            })
            .max(20, {
                message: 'Password length can not be more than 20 characters',
            }),
        email: z
            .string({
                required_error: 'Email is required',
                invalid_type_error: 'Email must be a string',
            })
            .email({ message: 'Invalid email address' }),
        phone: z.string({
            required_error: 'Phone Number is required',
            invalid_type_error: 'Phone Number must be a string',
        }),
        address: z
            .string({
                required_error: 'Address is required',
                invalid_type_error: 'Address must be a string',
            })
            .transform((val) => val.trim()),
    }),
});

export const userValidations = {
    createUserValidationSchema,
};
