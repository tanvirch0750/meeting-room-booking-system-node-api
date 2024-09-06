import { Schema, model } from 'mongoose';
import { IRoom, IRoomMethods, IRoomModel } from './room.interface';

const roomSchema = new Schema<IRoom, IRoomModel, IRoomMethods>(
    {
        name: { type: String, required: true, unique: true },
        roomNo: { type: Number, required: true, unique: true },
        floorNo: { type: Number, required: true },
        capacity: { type: Number, required: true },
        pricePerSlot: { type: Number, required: true },
        amenities: { type: [String], required: true },
        isDeleted: { type: Boolean, default: false },
        images: { type: [String], required: true },
        category: {
            type: Schema.Types.ObjectId,
            ref: 'Category',
            required: true,
        },
        isFeatured: { type: Boolean, default: false },
        description: { type: String, required: true },
    },
    {
        timestamps: true,
    },
);

// filter out deleted documents
roomSchema.pre('find', function (next) {
    this.find({ isDeleted: { $ne: true } });
    next();
});

roomSchema.pre('findOne', function (next) {
    this.find({ isDeleted: { $ne: true } });
    next();
});

roomSchema.pre('aggregate', function (next) {
    this.pipeline().unshift({ $match: { isDeleted: { $ne: true } } });
    next();
});

export const Room = model<IRoom, IRoomModel>('Room', roomSchema);
