import { Types } from 'mongoose';
import QueryBuilder from '../../builder/QueryBuilder';
import AppError from '../../errors/appError';
import { ReviewSearchableFields } from './reviews.constant';
import { IReview } from './reviews.interface';
import { Review } from './reviews.model';

const createReviewIntoDB = async (payload: IReview) => {
    const result = await Review.create(payload);
    return result;
};

const getAllReviewsFromDB = async (query: Record<string, unknown>) => {
    const reviewQuery = new QueryBuilder(
        Review.find().populate('user').populate('room'),
        query,
    )
        .search(ReviewSearchableFields)
        .filter()
        .sort()
        .paginate()
        .fields();

    const result = await reviewQuery.modelQuery;
    return result;
};

const getSingleReviewFromDB = async (id: string) => {
    const result = await Review.findById(id).populate('user').populate('room');

    if (!result)
        throw new AppError(404, `No Review found with (${id}) this id`);

    return result;
};

const updateReviewIntoDB = async (id: string, payload: Partial<IReview>) => {
    // Check if the booking exists
    const reviewExists = await Review.findById(id);
    if (!reviewExists) {
        throw new AppError(404, `Review not found with ID: ${id}`);
    }

    const result = await Review.findOneAndUpdate({ _id: id }, payload, {
        new: true,
    });
    return result;
};

const deleteReviewFromDB = async (id: string) => {
    // Check if the booking exists
    const reviewExists = await Review.findById(id);
    if (!reviewExists) {
        throw new AppError(404, `Review not found with ID: ${id}`);
    }

    const result = await Review.updateOne({ _id: id }, { isDeleted: true });

    return result;
};

const getRoomReviewStatsFromDB = async (roomId: string) => {
    const objectIdRoom =
        typeof roomId === 'string' ? new Types.ObjectId(roomId) : roomId;

    const roomStats = await Review.aggregate([
        {
            $match: {
                room: objectIdRoom,
                isDeleted: false,
            },
        },
        {
            $group: {
                _id: '$room',
                totalReviews: { $sum: 1 },
                averageRating: { $avg: '$rating' },
            },
        },
    ]);

    if (roomStats.length === 0) {
        throw new AppError(404, `No reviews found for room with ID: ${roomId}`);
    }

    return roomStats[0];
};

const getReviewsByRoomId = async (roomId: string) => {
    const reviews = await Review.find({ room: roomId, isDeleted: false })
        .populate('user')
        .populate('room');

    if (reviews.length === 0) {
        throw new AppError(404, `No reviews found for room with ID: ${roomId}`);
    }

    return reviews;
};

export const reviewServices = {
    createReviewIntoDB,
    getAllReviewsFromDB,
    getSingleReviewFromDB,
    updateReviewIntoDB,
    deleteReviewFromDB,
    getRoomReviewStatsFromDB,
    getReviewsByRoomId,
};
