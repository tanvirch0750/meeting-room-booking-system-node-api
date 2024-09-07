import mongoose, { Schema, model } from 'mongoose';
import { IBooking, IBookingMethods, IBookingModel } from './booking.interface';

const bookingSchema = new Schema<IBooking, IBookingModel, IBookingMethods>(
    {
        date: { type: String, required: true },
        slots: [{ type: mongoose.Types.ObjectId, ref: 'Slot', required: true }],
        room: { type: mongoose.Types.ObjectId, ref: 'Room', required: true },
        user: { type: mongoose.Types.ObjectId, ref: 'User', required: true },
        totalAmount: { type: Number, required: true },
        isConfirmed: { type: String, default: 'unconfirmed' },
        isDeleted: { type: Boolean, default: false },
        trxId: { type: String, required: true },
    },
    {
        timestamps: true,
    },
);

// filter out deleted documents
bookingSchema.pre('find', function (next) {
    this.find({ isDeleted: { $ne: true } });
    next();
});

bookingSchema.pre('findOne', function (next) {
    this.find({ isDeleted: { $ne: true } });
    next();
});

bookingSchema.pre('aggregate', function (next) {
    this.pipeline().unshift({ $match: { isDeleted: { $ne: true } } });
    next();
});

export const Booking = model<IBooking, IBookingModel>('Booking', bookingSchema);
