import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { bookingServices } from './booking.service';

const createBooking = catchAsync(async (req, res) => {
    const result = await bookingServices.createBooking(req.body);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Booking is created succesfully',
        data: result,
    });
});

const getAllBookings = catchAsync(async (req, res) => {
    const result = await bookingServices.getAllBookingsFromDB(req.query);

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
            message: 'Bookings are retrieved successfully',
            data: result,
        });
    }
});

const getBookingsByUser = catchAsync(async (req, res) => {
    const { userEmail } = req.user;

    const result = await bookingServices.getBookingByUserFromDB(userEmail);

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
            message: 'Bookings are retrieved successfully',
            data: result,
        });
    }
});

const updateBooking = catchAsync(async (req, res) => {
    const { id } = req.params;
    const result = await bookingServices.updateBookingIntoDB(id, req.body);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Room is updated succesfully',
        data: result,
    });
});

const deleteBooking = catchAsync(async (req, res) => {
    const { id } = req.params;
    const result = await bookingServices.deleteBookingFromDB(id);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Room is deleted succesfully',
        data: result,
    });
});

const reviewAddedtoBooking = catchAsync(async (req, res) => {
    const { id } = req.params;

    const result = await bookingServices.markReviewAddedByBookingById(
        id,
        req.body,
    );

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Review added succesfully',
        data: result,
    });
});

const cancelBooking = catchAsync(async (req, res) => {
    const result = await bookingServices.cancelBookingFromDB(req.body);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Booking is cancelled succesfully',
        data: result,
    });
});

export const bookingController = {
    createBooking,
    getAllBookings,
    getBookingsByUser,
    updateBooking,
    deleteBooking,
    cancelBooking,
    reviewAddedtoBooking,
};
