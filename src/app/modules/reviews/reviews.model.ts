import { Schema, model } from 'mongoose';
import { IReview, IReviewMethods, IReviewModel } from './reviews.interface';

const reviewSchema = new Schema<IReview, IReviewModel, IReviewMethods>(
    {
        review: { type: String, required: true },
        rating: { type: Number, default: 5 },
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        room: {
            type: Schema.Types.ObjectId,
            ref: 'Room',
            required: true,
        },
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

export const Review = model<IReview, IReviewModel>('Review', reviewSchema);
