import { ErrorRequestHandler, Response } from 'express';
import { ZodError } from 'zod';
import config from '../config';
import AppError from '../errors/appError';
import {
    handleBadValueError,
    handleCastErrorDB,
    handleDuplicateFieldsErrorDB,
    handleDuplicateKeyErrorInTrsAndRb,
    handleValidationErrorDB,
    handleValidationErrorTrsAndRb,
    handleZodError,
} from '../errors/common/commonErrors';

const sendErrorToDev = (err: AppError, res: Response) => {
    res.status(err.statusCode).json({
        statusCode: err.statusCode,
        success: false,
        status: err.status,
        message: err.message,
        errorSources: err.errorSources,
        stack: err?.stack,
        error: err,
    });
};

const sendErrorToProd = (err: AppError, res: Response) => {
    if (err.isOperational) {
        res.status(err.statusCode).json({
            statusCode: err.statusCode,
            success: false,
            status: err.status,
            message: err.message,
            errorSources: err.errorSources,
        });
    } else {
        // log the error
        console.error(`🛑 Production ERROR`, err);

        res.status(500).json({
            status: 'error',
            message: 'Something went wrong',
        });
    }
};

const allErrors = (err: any) => {
    let error = { ...err };

    if (err instanceof ZodError) {
        error = handleZodError(error);
    }

    if (err?.name === 'CastError') error = handleCastErrorDB(error);
    if (err?.code === 11000) error = handleDuplicateFieldsErrorDB(error);
    if (err?.name === 'ValidationError') {
        error = handleValidationErrorDB(error);
    }
    if (config.env === 'production') {
        if (err?.code === 2) error = handleBadValueError();
    }

    // special cases when use trasaction and rollback
    if (err.message.includes('11000')) {
        // duplicate error
        error = handleDuplicateKeyErrorInTrsAndRb(err);
    }
    if (err.message.includes('ValidationError')) {
        // validation error error

        error = handleValidationErrorTrsAndRb(err);
    }

    return error;
};

const globalErrorHandler: ErrorRequestHandler = (err, req, res, next) => {
    if (config.env === 'development') {
        // eslint-disable-next-line no-console
        console.log('🚀 globalErrorHandler ~~ ', err);
    } else {
        console.error('🚀 globalErrorHandler ~~ ', err);
    }

    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    if (config.env === 'development') {
        const error = allErrors(err);

        if (err instanceof AppError) {
            sendErrorToDev(err, res);
        } else if (err instanceof Error || err instanceof ZodError) {
            sendErrorToDev(error, res);
        }
    } else if (config.env === 'production') {
        const error = allErrors(err);

        if (err instanceof AppError) {
            sendErrorToProd(err, res);
        } else if (err instanceof Error) {
            sendErrorToProd(error, res || err instanceof ZodError);
        }
    }

    next();
};

export default globalErrorHandler;
