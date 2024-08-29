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

export const reviewServices = {
    createReviewIntoDB,
    getAllReviewsFromDB,
    getSingleReviewFromDB,
    updateReviewIntoDB,
    deleteReviewFromDB,
};
