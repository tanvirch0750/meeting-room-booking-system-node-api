import { z } from 'zod';

const timeStringSchema = z.string().refine(
    (time) => {
        const regex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/; // 00-09 10-19 20-23
        return regex.test(time);
    },
    {
        message: 'Invalid time format , expected "HH:MM" in 24 hours format',
    },
);

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
const createSlotValidationSchema = z.object({
    body: z.object({
        room: z.string({
            required_error: 'Room Id is required',
            invalid_type_error: 'Room Id must be a string',
        }),
        date: dateStringSchema,
        startTime: timeStringSchema, // HH: MM   00-23: 00-59
        endTime: timeStringSchema,
    }),
});

const updateSlotValidationSchema = z.object({
    body: z.object({
        room: z.string().optional(),
        date: dateStringSchema.optional(),
        startTime: timeStringSchema.optional(),
        endTime: timeStringSchema.optional(),
    }),
});

export const slotValidations = {
    createSlotValidationSchema,
    updateSlotValidationSchema,
};
