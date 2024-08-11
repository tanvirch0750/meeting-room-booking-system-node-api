import { z } from 'zod';

// User schema
const createRoomValidationSchema = z.object({
    body: z.object({
        name: z.string({
            required_error: 'Room name is required',
            invalid_type_error: 'Room name must be a string',
        }),
        roomNo: z.number({
            required_error: 'Room number is required',
            invalid_type_error: 'Room number must be a number',
        }),
        floorNo: z.number({
            required_error: 'Floor number number is required',
            invalid_type_error: 'Floor number must be a number',
        }),

        capacity: z.number({
            required_error: 'Capacity is required',
            invalid_type_error: 'Capatcity must be a number',
        }),
        pricePerSlot: z.number({
            required_error: 'Price per slot is required',
            invalid_type_error: 'price per slot must be a number',
        }),

        amenities: z
            .array(z.string(), {
                required_error: 'Amenities are required',
                invalid_type_error: 'Amenities must be an array of strings',
            })
            .min(1, 'At least one amenity is required'),
    }),
});

const updateRoomalidationSchema = z.object({
    body: z.object({
        name: z.string().optional(),
        roomNo: z.number().optional(),
        floorNo: z.number().optional(),
        capacity: z.number().optional(),
        pricePerSlot: z.number().optional(),
        amenities: z.array(z.string()).optional(),
    }),
});

export const roomValidations = {
    createRoomValidationSchema,
    updateRoomalidationSchema,
};
