import { z } from 'zod';

const loginValidationSchema = z.object({
    body: z.object({
        email: z
            .string({
                required_error: 'Email is required',
                invalid_type_error: 'Email must be a string',
            })
            .email({ message: 'Invalid email address' }),
        password: z
            .string({
                required_error: 'Password is required',
                invalid_type_error: 'Password must be a string',
            })
            .max(20, {
                message: 'Password length can not be more than 20 characters',
            }),
    }),
});

const refreshTokenValidationSchema = z.object({
    cookies: z.object({
        refreshToken: z.string({
            required_error: 'Refresh token is required!',
        }),
    }),
});

export const AuthValidation = {
    loginValidationSchema,
    refreshTokenValidationSchema,
};
