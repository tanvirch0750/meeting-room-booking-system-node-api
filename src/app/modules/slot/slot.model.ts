import { Schema, model } from 'mongoose';
import { ISlot, ISlotMethods, ISlotModel } from './slot.interface';

const slotSchema = new Schema<ISlot, ISlotModel, ISlotMethods>(
    {
        room: { type: Schema.Types.ObjectId, ref: 'Room', required: true },
        date: { type: String, required: true },
        startTime: { type: String, required: true },
        endTime: { type: String, required: true },
        isBooked: { type: Boolean, default: false },
        isDeleted: { type: Boolean, default: false },
        roomName: { type: String },
    },
    {
        timestamps: true,
    },
);

// filter out deleted documents
slotSchema.pre('find', function (next) {
    this.find({ isDeleted: { $ne: true } });
    next();
});

slotSchema.pre('findOne', function (next) {
    this.find({ isDeleted: { $ne: true } });
    next();
});

slotSchema.pre('aggregate', function (next) {
    this.pipeline().unshift({ $match: { isDeleted: { $ne: true } } });
    next();
});

export const Slot = model<ISlot, ISlotModel>('Slot', slotSchema);
