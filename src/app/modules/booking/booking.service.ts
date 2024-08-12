import mongoose from 'mongoose';
import AppError from '../../errors/appError';
import { Room } from '../room/room.model';
import { Slot } from '../slot/slot.model';
import { User } from '../user/user.model';
import { IBooking } from './booking.interface';
import { Booking } from './booking.model';

export const createBooking = async (payload: IBooking) => {
    const { date, slots, room, user } = payload;

    const session = await mongoose.startSession();

    try {
        session.startTransaction();

        // Check if the room exists
        const roomExists = await Room.findById(room).session(session);

        if (!roomExists) {
            throw new AppError(404, `Room not found`);
        }

        // Check if the user exist
        const userExists = await User.findById(user).session(session);

        if (!userExists) {
            throw new AppError(404, `User not found`);
        }

        // Check if the slots exist and are not booked
        const existingSlots = await Slot.find({
            _id: { $in: slots },
            room,
            date,
            isBooked: false,
        }).session(session);

        if (existingSlots.length !== slots.length) {
            throw new AppError(
                400,
                `Some slots are already booked or do not exist`,
            );
        }

        // Create the booking
        const newBooking = new Booking({
            date,
            slots,
            room,
            user,
            totalAmount: existingSlots.length * roomExists.pricePerSlot,
            isConfirmed: 'unconfirmed',
            isDeleted: false,
        });

        // Mark the slots as booked
        await Slot.updateMany(
            { _id: { $in: slots } },
            { isBooked: true },
            { session },
        );

        // Save the booking
        await newBooking.save({ session });

        await session.commitTransaction();
        session.endSession();

        // Populate slots, user, and room
        const populatedBooking = await Booking.findById(newBooking._id)
            .populate('slots')
            .populate('user', 'name email phone address role')
            .populate(
                'room',
                'name roomNo floorNo capacity pricePerSlot amenities isDeleted',
            );

        return populatedBooking;
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        throw error;
    }
};

export const bookingServices = {
    createBooking,
};
