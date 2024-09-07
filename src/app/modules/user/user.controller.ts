import httpStatus from 'http-status';
import jwt, { JwtPayload } from 'jsonwebtoken';
import config from '../../config';
import AppError from '../../errors/appError';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { userServices } from './user.service';

const getAllUsers = catchAsync(async (req, res) => {
    const result = await userServices.getAllUsersFromDB();

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

const getSingleUser = catchAsync(async (req, res) => {
    const { id } = req.params;
    const result = await userServices.getUserById(id);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'User is retrieved succesfully',
        data: result,
    });
});

const updateUser = catchAsync(async (req, res) => {
    const { id } = req.params;
    const result = await userServices.updateUserIntoDB(id, req.body);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'user is updated succesfully',
        data: result,
    });
});

const getProfileData = catchAsync(async (req, res) => {
    console.log('ddddddddddddddddddddddd');
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        throw new AppError(404, 'You are not authorized!');
    }

    // checking if the given token is valid
    const decoded = jwt.verify(
        token,
        config.jwt_access_secret as string,
    ) as JwtPayload;

    const result = await userServices.getProfileData(decoded);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Profile data retrived succesfully',
        data: result,
    });
});

export const userControllers = {
    getAllUsers,
    getSingleUser,
    getProfileData,
    updateUser,
};
