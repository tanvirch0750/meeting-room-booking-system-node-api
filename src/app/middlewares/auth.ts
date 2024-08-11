import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import jwt, { JwtPayload } from 'jsonwebtoken';
import config from '../config';

import AppError from '../errors/appError';
import { IRole } from '../modules/user/user.interface';
import { User } from '../modules/user/user.model';
import catchAsync from '../utils/catchAsync';

const auth = (...requiredRoles: IRole[]) => {
    return catchAsync(
        async (req: Request, res: Response, next: NextFunction) => {
            const token = req.headers.authorization?.split(' ')[1];

            // checking if the token is missing
            if (!token) {
                throw new AppError(
                    httpStatus.UNAUTHORIZED,
                    'You are not authorized!',
                );
            }

            // checking if the given token is valid
            const decoded = jwt.verify(
                token,
                config.jwt_access_secret as string,
            ) as JwtPayload;

            const { role, userEmail, iat } = decoded;

            // checking if the user is exist
            const user = await User.isUserExistsByEmail(userEmail);

            if (!user) {
                throw new AppError(
                    httpStatus.NOT_FOUND,
                    'This user is not found !',
                );
            }

            // checking if the user is already deleted
            const isDeleted = user?.isDeleted;

            if (isDeleted) {
                throw new AppError(
                    httpStatus.FORBIDDEN,
                    'This user is deleted !',
                );
            }

            // TODO: is user change password

            if (requiredRoles && !requiredRoles.includes(role)) {
                throw new AppError(
                    httpStatus.UNAUTHORIZED,
                    'You are not authorized',
                );
            }

            req.user = decoded as JwtPayload;
            next();
        },
    );
};

export default auth;
