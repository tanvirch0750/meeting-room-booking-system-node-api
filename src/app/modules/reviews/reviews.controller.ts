import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { reviewServices } from './reviews.service';

const createReview = catchAsync(async (req, res) => {
    const result = await reviewServices.createReviewIntoDB(req.body);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Review is created succesfully',
        data: result,
    });
});

const getAllReviews = catchAsync(async (req, res) => {
    const result = await reviewServices.getAllReviewsFromDB(req.query);

    if (result.length <= 0) {
        sendResponse(res, {
            statusCode: 404,
            success: false,
            message: 'No Data Found',
            data: [],
        });
    } else {
        sendResponse(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: 'Reviews are retrieved successfully',
            data: result,
        });
    }
});

const getSingleReview = catchAsync(async (req, res) => {
    const { id } = req.params;
    const result = await reviewServices.getSingleReviewFromDB(id);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Review is retrieved succesfully',
        data: result,
    });
});

const updateReview = catchAsync(async (req, res) => {
    const { id } = req.params;
    const result = await reviewServices.updateReviewIntoDB(id, req.body);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Review is updated succesfully',
        data: result,
    });
});

const deleteReview = catchAsync(async (req, res) => {
    const { id } = req.params;
    const result = await reviewServices.deleteReviewFromDB(id);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Review is deleted succesfully',
        data: result,
    });
});

export const reviewControllers = {
    createReview,
    getAllReviews,
    getSingleReview,
    updateReview,
    deleteReview,
};
