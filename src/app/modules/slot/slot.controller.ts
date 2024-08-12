import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { slotServices } from './slot.service';

const createSlot = catchAsync(async (req, res) => {
    const result = await slotServices.createSlotIntoDB(req.body);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Slot is created succesfully',
        data: result,
    });
});

const getAvailableSlots = catchAsync(async (req, res) => {
    const result = await slotServices.getAvailableSlotsFromDB(req.query);

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
            message: 'Available slots retrived succesfully',
            data: result,
        });
    }
});

export const slotController = {
    createSlot,
    getAvailableSlots,
};
