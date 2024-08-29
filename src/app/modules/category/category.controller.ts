import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { categoryServices } from './category.service';

const createCategory = catchAsync(async (req, res) => {
    const result = await categoryServices.createCategoryIntoDB(req.body);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Category is created succesfully',
        data: result,
    });
});

const getAllCategories = catchAsync(async (req, res) => {
    const result = await categoryServices.getAllCategoriesFromDB(req.query);

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
            message: 'Categories are retrieved successfully',
            data: result,
        });
    }
});

const getSingleCategory = catchAsync(async (req, res) => {
    const { id } = req.params;
    const result = await categoryServices.getSingleCategoryFromDB(id);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Category is retrieved succesfully',
        data: result,
    });
});

const updateCategory = catchAsync(async (req, res) => {
    const { id } = req.params;
    const result = await categoryServices.updateCategoryIntoDB(id, req.body);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Category is updated succesfully',
        data: result,
    });
});

const deleteCategory = catchAsync(async (req, res) => {
    const { id } = req.params;
    const result = await categoryServices.deleteCategoryFromDB(id);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Category is deleted succesfully',
        data: result,
    });
});

export const categoryControllers = {
    createCategory,
    getAllCategories,
    getSingleCategory,
    updateCategory,
    deleteCategory,
};
