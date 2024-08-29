import { Schema, model } from 'mongoose';
import { ICq, ICqMethods, ICqModel } from './cq.interface';

const reviewSchema = new Schema<ICq, ICqModel, ICqMethods>(
    {
        name: { type: String, required: true },
        email: { type: String, required: true },
        subject: { type: String, required: true },
        query: { type: String, required: true },
        isAnswered: { type: Boolean, default: false },
        isDeleted: { type: Boolean, default: false },
    },
    {
        timestamps: true,
    },
);

// filter out deleted documents
reviewSchema.pre('find', function (next) {
    this.find({ isDeleted: { $ne: true } });
    next();
});

reviewSchema.pre('findOne', function (next) {
    this.find({ isDeleted: { $ne: true } });
    next();
});

reviewSchema.pre('aggregate', function (next) {
    this.pipeline().unshift({ $match: { isDeleted: { $ne: true } } });
    next();
});

export const Cq = model<ICq, ICqModel>('Customer_Queries', reviewSchema);
