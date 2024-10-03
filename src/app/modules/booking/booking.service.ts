/* eslint-disable @typescript-eslint/no-explicit-any */
import mongoose from 'mongoose';
import QueryBuilder from '../../builder/QueryBuilder';
import AppError from '../../errors/appError';
import { initiatePayment } from '../payment/payment.utils';
import { Room } from '../room/room.model';
import { Slot } from '../slot/slot.model';
import { User } from '../user/user.model';
import { BookingSearchableFields } from './booking.constant';
import { IBooking } from './booking.interface';
import { Booking } from './booking.model';
import { generateTransactionId } from './booking.utils';

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
            isBooked: false,
        }).session(session);

        if (existingSlots.length !== slots.length) {
            throw new AppError(
                400,
                `Some slots are already booked or do not exist`,
            );
        }

        const trxId = generateTransactionId();
        const totalAmount = existingSlots.length * roomExists.pricePerSlot;

        // Create the booking
        const newBooking = new Booking({
            date,
            slots,
            room,
            user,
            totalAmount,
            isConfirmed: 'unconfirmed',
            isDeleted: false,
            trxId,
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

        const paymentData = {
            trxId,
            totalPrice: totalAmount,
            custormerName: userExists?.name,
            customerEmail: userExists?.email,
            customerPhone: userExists.phone,
            customerAddress: userExists.address,
        };

        // initiate payment
        const paymentSession = await initiatePayment(paymentData);

        return {
            bookingData: populatedBooking,
            paymentSession,
        };
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        throw error;
    }
};

const getAllBookingsFromDB = async (query: Record<string, unknown>) => {
    const bookingQuery = new QueryBuilder(
        Booking.find()
            .populate('slots', 'room date startTime endTime isBooked')
            .populate('user', 'name email phone address role')
            .populate(
                'room',
                'name roomNo floorNo capacity pricePerSlot amenities isDeleted',
            ),
        query,
    )
        .search(BookingSearchableFields)
        .filter()
        .sort()
        .paginate()
        .fields();

    const result = await bookingQuery.modelQuery;
    return result;
};

const getBookingByUserFromDB = async (email: string) => {
    // Find user by email
    const user = await User.findOne({ email });

    if (!user) {
        throw new AppError(404, 'User not found');
    }

    // Find bookings associated with the user
    const bookings = await Booking.find({ user: user._id })
        .populate('slots', 'room date startTime endTime isBooked')
        .populate('user', 'name email phone address role')
        .populate(
            'room',
            'name roomNo floorNo capacity pricePerSlot amenities isDeleted',
        );

    return bookings;
};

const updateBookingIntoDB = async (id: string, payload: Partial<IBooking>) => {
    // Check if the booking exists
    const bookingExists = await Booking.findById(id);
    if (!bookingExists) {
        throw new AppError(404, `Booking not found with ID: ${id}`);
    }

    const result = await Booking.findOneAndUpdate({ _id: id }, payload, {
        new: true,
    });
    return result;
};

const deleteBookingFromDB = async (id: string) => {
    // Check if the booking exists
    const bookingExists = await Booking.findById(id);
    if (!bookingExists) {
        throw new AppError(404, `Booking not found with ID: ${id}`);
    }

    const result = await Booking.updateOne({ _id: id }, { isDeleted: true });

    return result;
};

const cancelBookingFromDB = async (payload: any) => {
    await Booking.findOneAndUpdate(
        { trxId: payload.transactionId },
        {
            isConfirmed: 'cancelled',
        },
    );

    const booking = await Booking.findOne({ trxId: payload.transactionId });

    let slots;

    if (booking) {
        slots = booking.slots;
    }

    // Mark the slots as booked
    await Slot.updateMany({ _id: { $in: slots } }, { isBooked: false });

    return { message: 'Booking canceled' };
};

const markReviewAddedByBookingById = async (
    id: string,
    payload: Partial<IBooking>,
) => {
    // Check if the booking exists
    const bookingExists = await Booking.findById(id);
    if (!bookingExists) {
        throw new AppError(404, `Booking not found with ID: ${id}`);
    }

    const result = await Booking.updateOne(
        { _id: id },
        { isReviewAdded: true, reviewId: payload?.reviewId },
    );

    return result;
};

export const bookingServices = {
    createBooking,
    getAllBookingsFromDB,
    getBookingByUserFromDB,
    updateBookingIntoDB,
    deleteBookingFromDB,
    cancelBookingFromDB,
    markReviewAddedByBookingById,
};
