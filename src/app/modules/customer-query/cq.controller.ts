import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { cqServices } from './cq.service';

const createCq = catchAsync(async (req, res) => {
    const result = await cqServices.createCqIntoDB(req.body);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Thank you for your submission',
        data: result,
    });
});

const getAllCqs = catchAsync(async (req, res) => {
    const result = await cqServices.getAllCqsFromDB(req.query);

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
            message: 'Customer queiries are retrieved successfully',
            data: result,
        });
    }
});

const getSingleCq = catchAsync(async (req, res) => {
    const { id } = req.params;
    const result = await cqServices.getSingleCqFromDB(id);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Customer query is retrieved succesfully',
        data: result,
    });
});

const updateCq = catchAsync(async (req, res) => {
    const { id } = req.params;
    const result = await cqServices.updateCqIntoDB(id, req.body);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Customer query is updated succesfully',
        data: result,
    });
});

const deleteCq = catchAsync(async (req, res) => {
    const { id } = req.params;
    const result = await cqServices.deleteCqFromDB(id);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Cq is deleted succesfully',
        data: result,
    });
});

export const cqControllers = {
    createCq,
    getAllCqs,
    getSingleCq,
    updateCq,
    deleteCq,
};
