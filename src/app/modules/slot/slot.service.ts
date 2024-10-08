import mongoose from 'mongoose';
import QueryBuilder from '../../builder/QueryBuilder';
import AppError from '../../errors/appError';
import { Room } from '../room/room.model';
import { SlotSearchableFields } from './slot.constant';
import { ISlot } from './slot.interface';
import { Slot } from './slot.model';
import { minutesToTime, timeToMinutes } from './slot.utils';

const createSlotIntoDB = async (payload: ISlot) => {
    const { room, date, startTime, endTime } = payload;

    // Check if the date is in the past
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0); // Reset time part of current date

    const slotDate = new Date(date);

    if (slotDate < currentDate) {
        throw new AppError(400, `Cannot create a slot for a previous date`);
    }

    // Convert Times to Minutes
    const startMinutes = timeToMinutes(startTime);
    const endMinutes = timeToMinutes(endTime);

    if (startMinutes >= endMinutes) {
        throw new AppError(400, `End time must be after start time`);
    }

    // Slot Duration
    const slotDuration = 60; // minutes

    // Calculate Total Duration and Number of Slots
    const totalDuration = endMinutes - startMinutes;
    const numberOfSlots = Math.floor(totalDuration / slotDuration);

    if (numberOfSlots <= 0) {
        throw new AppError(
            400,
            `Duration is too short to create slots. Duration must be atleast 1 hour`,
        );
    }

    const session = await mongoose.startSession();

    try {
        session.startTransaction();
        // Check if Room Exists
        const roomExists = await Room.findById(room).session(session);
        if (!roomExists) {
            throw new AppError(404, `Room Not Found`);
        }

        // Check for Existing Slots in Database
        const existingSlots = await Slot.find({
            room,
            date,
            $or: [
                {
                    $and: [
                        { startTime: { $lt: endTime } },
                        { endTime: { $gt: startTime } },
                    ],
                },
            ],
        }).session(session);

        if (existingSlots.length > 0) {
            throw new AppError(404, `Overlapping slots detected`);
        }

        // Generate and Save Slots
        const slots = [];
        for (let i = 0; i < numberOfSlots; i++) {
            const slotStart = minutesToTime(startMinutes + i * slotDuration);
            const slotEnd = minutesToTime(
                startMinutes + (i + 1) * slotDuration,
            );

            const newSlot = new Slot({
                room,
                date,
                startTime: slotStart,
                endTime: slotEnd,
                isBooked: false,
                isDeleted: false,
                roomName: roomExists?.name,
            });

            await newSlot.save({ session });
            slots.push(newSlot);
        }

        await session.commitTransaction();
        session.endSession();

        return slots;
    } catch (error: any) {
        await session.abortTransaction();
        await session.endSession();
        throw error;
    }
};

const getAvailableSlotsFromDB = async (query: Record<string, unknown>) => {
    const { date, roomId } = query;

    if (roomId) {
        query.room = query.roomId;
        delete query.roomId;
    }

    // Get current date, reset time to start of the day, and format it as "YYYY-MM-DD"
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);
    const formattedCurrentDate = currentDate.toISOString().split('T')[0]; // "YYYY-MM-DD"

    // Start building the query
    let slotQuery = Slot.find({ isBooked: false, isDeleted: false });

    // Remove slots that are for previous dates by comparing with the formatted date string
    // @ts-ignore
    // slotQuery = slotQuery.where('date').gte(formattedCurrentDate);

    // Filter by date if provided
    if (date) {
        slotQuery = slotQuery.where('date').equals(date);
    }

    // Filter by roomId if provided
    if (roomId) {
        slotQuery = slotQuery.where('room').equals(roomId);
    }

    const roomQuery = new QueryBuilder(slotQuery.populate('room'), query)
        .search(SlotSearchableFields)
        .filter()
        .sort()
        .paginate()
        .fields();

    const result = await roomQuery.modelQuery;
    return result;
};

// const getAvailableSlotsFromDB = async (query: Record<string, unknown>) => {
//     const { date, roomId } = query;

//     if (roomId) {
//         query.room = query.roomId;
//         delete query.roomId;
//     }

//     // Get current date, reset time to start of the day
//     const currentDate = new Date();
//     currentDate.setHours(0, 0, 0, 0);

//     // Start building the query
//     let slotQuery = Slot.find({ isBooked: false, isDeleted: false });

//     // Remove slots that are for previous dates
//     slotQuery = slotQuery.where('date').gte(currentDate as unknown as number);

//     // Filter by date if provided
//     if (date) {
//         slotQuery = slotQuery.where('date').equals(date);
//     }

//     // Filter by roomId if provided
//     if (roomId) {
//         slotQuery = slotQuery.where('room').equals(roomId);
//     }

//     const roomQuery = new QueryBuilder(slotQuery.populate('room'), query)
//         .search(SlotSearchableFields)
//         .filter()
//         .sort()
//         .paginate()
//         .fields();

//     const result = await roomQuery.modelQuery;
//     return result;
// };

const getAllSlotsFromDB = async (query: Record<string, unknown>) => {
    const { date, roomId } = query;

    if (roomId) {
        query.room = query.roomId;
        delete query.roomId;
    }

    // Start building the query
    let slotQuery = Slot.find({ isDeleted: false });

    // Filter by date if provided
    if (date) {
        slotQuery = slotQuery.where('date').equals(new Date(date as string));
    }

    // Filter by roomId if provided
    if (roomId) {
        slotQuery = slotQuery.where('room').equals(roomId);
    }

    const roomQuery = new QueryBuilder(slotQuery.populate('room'), query)
        .search(SlotSearchableFields)
        .filter()
        .sort()
        .paginate()
        .fields();

    const result = await roomQuery.modelQuery;
    return result;
};

const getSingleSlotFromDB = async (id: string) => {
    const result = await Slot.findById(id).populate('room');

    if (!result) throw new AppError(404, `No slot found with (${id}) this id`);

    return result;
};

const updateSlotInDB = async (slotId: string, payload: Partial<ISlot>) => {
    const { room, date, startTime, endTime } = payload;

    // Check if the date is in the past
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0); // Reset time part of current date

    const slotDate = date ? new Date(date) : null;

    if (slotDate && slotDate < currentDate) {
        throw new AppError(400, `Cannot update a slot to a previous date`);
    }

    // Convert Times to Minutes if startTime and endTime are provided
    const startMinutes = startTime ? timeToMinutes(startTime) : null;
    const endMinutes = endTime ? timeToMinutes(endTime) : null;

    if (startMinutes !== null && endMinutes !== null) {
        if (startMinutes >= endMinutes) {
            throw new AppError(400, `End time must be after start time`);
        }

        // Slot Duration Check
        const slotDuration = 60; // minutes
        const totalDuration = endMinutes - startMinutes;

        if (totalDuration < slotDuration) {
            throw new AppError(
                400,
                `Duration is too short to create a valid slot. Duration must be at least 1 hour`,
            );
        }
    }

    // Check if Slot Exists
    const existingSlot = await Slot.findById(slotId);
    if (!existingSlot) {
        throw new AppError(404, `Slot Not Found`);
    }

    // Check if Room Exists (if room is being updated)
    if (room) {
        const roomExists = await Room.findById(room);
        if (!roomExists) {
            throw new AppError(404, `Room Not Found`);
        }
    }

    // Check for Existing Slots in Database
    const existingSlots = await Slot.find({
        room,
        date,
        $or: [
            {
                $and: [
                    { startTime: { $lt: endTime } },
                    { endTime: { $gt: startTime } },
                ],
            },
        ],
    });

    if (existingSlots.length > 0) {
        throw new AppError(404, `Overlapping slots detected`);
    }

    const result = await Slot.findOneAndUpdate({ _id: slotId }, payload, {
        new: true,
    });

    return result;
};

const deleteSlotFromDB = async (id: string) => {
    // Check if the booking exists
    const slotExists = await Slot.findById(id);
    if (!slotExists) {
        throw new AppError(404, `Slot not found with ID: ${id}`);
    }

    if (slotExists?.isBooked) {
        throw new AppError(404, `This slot is already booked`);
    }

    const result = await Slot.findByIdAndDelete(id);

    return result;
};

const createMonthlySlots = async (payload: any) => {
    const {
        room,
        startTime = '01:00',
        endTime = '23:00',
        month,
        year,
    } = payload;

    // Validate month and year in payload
    if (!month || !year) {
        throw new AppError(400, `Month and year must be provided`);
    }

    // Convert Times to Minutes
    const startMinutes = timeToMinutes(startTime);
    const endMinutes = timeToMinutes(endTime);

    if (startMinutes >= endMinutes) {
        throw new AppError(400, `End time must be after start time`);
    }

    // Slot Duration
    const slotDuration = 60; // minutes

    // Calculate Total Duration and Number of Slots per day
    const totalDuration = endMinutes - startMinutes;
    const numberOfSlots = Math.floor(totalDuration / slotDuration);

    if (numberOfSlots <= 0) {
        throw new AppError(
            400,
            `Duration is too short to create slots. Duration must be at least 1 hour`,
        );
    }

    // Get total days in the given month and year
    const daysInMonth = new Date(year, month, 0).getDate();

    const session = await mongoose.startSession();

    try {
        session.startTransaction();

        // Check if Room Exists
        const roomExists = await Room.findById(room).session(session);
        if (!roomExists) {
            throw new AppError(404, `Room Not Found`);
        }

        const allSlots = [];

        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(year, month - 1, day)
                .toISOString()
                .split('T')[0]; // Format date as YYYY-MM-DD

            // Check for Existing Slots on that day
            const existingSlots = await Slot.find({
                room,
                date,
                $or: [
                    {
                        $and: [
                            { startTime: { $lt: endTime } },
                            { endTime: { $gt: startTime } },
                        ],
                    },
                ],
            }).session(session);

            if (existingSlots.length > 0) {
                throw new AppError(
                    404,
                    `Overlapping slots detected on ${date}`,
                );
            }

            const slots = [];
            for (let i = 0; i < numberOfSlots; i++) {
                const slotStart = minutesToTime(
                    startMinutes + i * slotDuration,
                );
                const slotEnd = minutesToTime(
                    startMinutes + (i + 1) * slotDuration,
                );

                const newSlot = new Slot({
                    room,
                    date,
                    startTime: slotStart,
                    endTime: slotEnd,
                    isBooked: false,
                    isDeleted: false,
                    roomName: roomExists?.name,
                });

                await newSlot.save({ session });
                slots.push(newSlot);
            }

            allSlots.push(...slots);
        }

        await session.commitTransaction();
        session.endSession();

        return allSlots;
    } catch (error: any) {
        await session.abortTransaction();
        await session.endSession();
        throw error;
    }
};

export const slotServices = {
    createSlotIntoDB,
    getAvailableSlotsFromDB,
    updateSlotInDB,
    getAllSlotsFromDB,
    deleteSlotFromDB,
    getSingleSlotFromDB,
    createMonthlySlots,
};
