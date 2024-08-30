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

    // Get current date, reset time to start of the day
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    // TODO: remove all the slots that is previous date

    // Start building the query
    let slotQuery = Slot.find({ isBooked: false, isDeleted: false });

    // Remove slots that are for previous dates
    slotQuery = slotQuery.where('date').gte(currentDate as unknown as number);

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

    const session = await mongoose.startSession();

    try {
        session.startTransaction();

        // Check if Slot Exists
        const existingSlot = await Slot.findById(slotId).session(session);
        if (!existingSlot) {
            throw new AppError(404, `Slot Not Found`);
        }

        // Check if Room Exists (if room is being updated)
        if (room) {
            const roomExists = await Room.findById(room).session(session);
            if (!roomExists) {
                throw new AppError(404, `Room Not Found`);
            }
        }

        // Check for Overlapping Slots
        if (startTime && endTime && room && date) {
            const overlappingSlots = await Slot.find({
                room,
                date,
                _id: { $ne: slotId }, // Exclude current slot from the check
                $or: [
                    {
                        $and: [
                            { startTime: { $lt: endTime } },
                            { endTime: { $gt: startTime } },
                        ],
                    },
                ],
            }).session(session);

            if (overlappingSlots.length > 0) {
                throw new AppError(400, `Overlapping slots detected`);
            }
        }

        // Update Slot Details
        if (room) existingSlot.room = room;
        if (date) existingSlot.date = date;
        if (startTime) existingSlot.startTime = startTime;
        if (endTime) existingSlot.endTime = endTime;

        await existingSlot.save({ session });

        await session.commitTransaction();
        session.endSession();

        return existingSlot;
    } catch (error: any) {
        await session.abortTransaction();
        await session.endSession();
        throw error;
    }
};

const deleteSlotFromDB = async (id: string) => {
    // Check if the booking exists
    const slotExists = await Slot.findById(id);
    if (!slotExists) {
        throw new AppError(404, `Slot not found with ID: ${id}`);
    }

    const result = await Slot.updateOne({ _id: id }, { isDeleted: true });

    return result;
};

export const slotServices = {
    createSlotIntoDB,
    getAvailableSlotsFromDB,
    updateSlotInDB,
    getAllSlotsFromDB,
    deleteSlotFromDB,
};
