/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */

import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import AppError from '../errors/appError';

const notFound = (req: Request, res: Response, next: NextFunction) => {
    next(
        new AppError(
            httpStatus.NOT_FOUND,
            `Can't find ${req.originalUrl} on this server`,
        ),
    );
    // return res.status(httpStatus.NOT_FOUND).json({
    //     success: false,
    //     status: 'fail',
    //     message: `Can't find ${req.originalUrl} on this server`,
    //     error: '',
    // });
};

export default notFound;
