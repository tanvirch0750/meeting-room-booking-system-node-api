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

export const slotController = {
    createSlot,
};
