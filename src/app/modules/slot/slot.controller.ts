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

const createMonthlySlot = catchAsync(async (req, res) => {
    const result = await slotServices.createMonthlySlots(req.body);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Monthly Slot is created succesfully',
        data: result,
    });
});

const updateSlot = catchAsync(async (req, res) => {
    const { id } = req.params;
    const result = await slotServices.updateSlotInDB(id, req.body);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Slot is updated succesfully',
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

const getAllSlots = catchAsync(async (req, res) => {
    const result = await slotServices.getAllSlotsFromDB(req.query);

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
            message: 'All slots retrived succesfully',
            data: result,
        });
    }
});

const deleteSlot = catchAsync(async (req, res) => {
    const { id } = req.params;
    const result = await slotServices.deleteSlotFromDB(id);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Slot is deleted succesfully',
        data: result,
    });
});

const getSingleSlot = catchAsync(async (req, res) => {
    const { id } = req.params;
    const result = await slotServices.getSingleSlotFromDB(id);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'slot is retrieved succesfully',
        data: result,
    });
});

export const slotController = {
    createSlot,
    getAvailableSlots,
    updateSlot,
    getAllSlots,
    deleteSlot,
    getSingleSlot,
    createMonthlySlot,
};
