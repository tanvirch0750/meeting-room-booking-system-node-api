import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { roomServices } from './room.service';

const createRoom = catchAsync(async (req, res) => {
    const result = await roomServices.createRoomIntoDB(req.body);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Room is created succesfully',
        data: result,
    });
});

const getAllRooms = catchAsync(async (req, res) => {
    const result = await roomServices.getAllRoomsFromDB(req.query);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Rooms are retrieved successfully',
        data: result,
    });
});

const getSingleRoom = catchAsync(async (req, res) => {
    const { id } = req.params;
    const result = await roomServices.getSingleRoomFromDB(id);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Room is retrieved succesfully',
        data: result,
    });
});

const updateRoom = catchAsync(async (req, res) => {
    const { id } = req.params;
    const result = await roomServices.updateRoomIntoDB(id, req.body);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Room is updated succesfully',
        data: result,
    });
});

const deleteRoom = catchAsync(async (req, res) => {
    const { id } = req.params;
    const result = await roomServices.deleteRoomFromDB(id);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Room is deleted succesfully',
        data: result,
    });
});

export const roomControllers = {
    createRoom,
    getAllRooms,
    getSingleRoom,
    updateRoom,
    deleteRoom,
};
