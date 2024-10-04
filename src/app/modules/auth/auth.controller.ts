/* eslint-disable no-unused-vars */
import httpStatus from 'http-status';
import config from '../../config';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { AuthServices } from './auth.service';

const signupUser = catchAsync(async (req, res) => {
    const result = await AuthServices.signupUser(req.body);

    const {
        password,
        isDeleted,
        createdAt,
        updatedAt,
        __v,
        ...userWithoutPassword
    } = result.toObject();

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'User registered successfully',
        data: userWithoutPassword,
    });
});

const loginUser = catchAsync(async (req, res) => {
    const result = await AuthServices.loginUser(req.body);
    const { refreshToken, accessToken, user } = result;

    const {
        password,
        isDeleted,
        createdAt,
        updatedAt,
        __v,
        ...userWithoutPassword
    } = user.toObject();

    res.cookie('refreshToken', refreshToken, {
        secure: config.NODE_ENV === 'production',
        httpOnly: true,
    });

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'User logged in succesfully!',
        token: accessToken,
        data: userWithoutPassword,
    });
});
const googleSignIn = catchAsync(async (req, res) => {
    const { idToken } = req.body;

    // Use the googleSignIn service to validate the Google ID token and generate custom JWTs
    const result = await AuthServices.googleSignIn(idToken);
    const { refreshToken, accessToken, user } = result;

    // Set the refresh token as a secure, httpOnly cookie
    res.cookie('refreshToken', refreshToken, {
        secure: config.NODE_ENV === 'production',
        httpOnly: true,
    });

    // Send the response back to the client with the access token and user details
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'User signed in with Google successfully!',
        token: accessToken,
        data: user,
    });
});

const refreshToken = catchAsync(async (req, res) => {
    const { refreshToken } = req.cookies;

    const result = await AuthServices.refreshToken(refreshToken);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Access token is retrieved succesfully!',
        data: result,
    });
});

export const AuthControllers = {
    loginUser,
    signupUser,
    refreshToken,
};
