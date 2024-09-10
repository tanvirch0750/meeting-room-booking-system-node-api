import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { dashboardServices } from './dashboard.service';

const getDashboardData = catchAsync(async (req, res) => {
    const result = await dashboardServices.getDashboardDataFromDb();

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Dashboard Data retrived successfully',
        data: result,
    });
});

export const dashboardController = {
    getDashboardData,
};
