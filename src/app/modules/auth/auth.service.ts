/* eslint-disable @typescript-eslint/no-var-requires */
import * as admin from 'firebase-admin';
import httpStatus from 'http-status';
import jwt, { JwtPayload } from 'jsonwebtoken';
import config from '../../config';
import AppError from '../../errors/appError';
import { IUser } from '../user/user.interface';
import { User } from '../user/user.model';
import { ILoginUser } from './auth.interface';
import { createToken } from './auth.utils';

// admin.initializeApp({
//     credential: admin.credential.cert(
//         require('../../config/keys/serviceAccountKey.json'),
//     ),
// });

const serviceAccount = JSON.parse(
    process.env.FIREBASE_SERVICE_ACCOUNT_KEY as string,
);

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

const signupUser = async (payload: IUser) => {
    const result = await User.create(payload);

    return result;
};

const loginUser = async (payload: ILoginUser) => {
    // checking if the user is exist
    const user = await User.isUserExistsByEmail(payload.email);

    if (!user) {
        throw new AppError(
            httpStatus.NOT_FOUND,
            'No user found with this email',
        );
    }
    // checking if the user is already deleted

    const isDeleted = user?.isDeleted;

    if (isDeleted) {
        throw new AppError(
            httpStatus.FORBIDDEN,
            'This user is no longer exist!',
        );
    }

    //checking if the password is correct
    if (!(await User.isPasswordMatched(payload?.password, user?.password)))
        throw new AppError(httpStatus.FORBIDDEN, 'Password do not matched');

    //create token and sent to the  client
    const jwtPayload = {
        userEmail: user.email,
        role: user.role,
    };

    const accessToken = createToken(
        jwtPayload,
        config.jwt_access_secret as string,
        config.jwt_access_expires_in as string,
    );

    const refreshToken = createToken(
        jwtPayload,
        config.jwt_refresh_secret as string,
        config.jwt_refresh_expires_in as string,
    );

    return {
        accessToken,
        refreshToken,
        user,
    };
};

const refreshToken = async (token: string) => {
    // checking if the given token is valid
    const decoded = jwt.verify(
        token,
        config.jwt_refresh_secret as string,
    ) as JwtPayload;

    const { userEmail } = decoded;

    // checking if the user is exist
    const user = await User.isUserExistsByEmail(userEmail);

    if (!user) {
        throw new AppError(httpStatus.NOT_FOUND, 'This user is not found !');
    }
    // checking if the user is already deleted
    const isDeleted = user?.isDeleted;

    if (isDeleted) {
        throw new AppError(httpStatus.FORBIDDEN, 'This user is deleted !');
    }

    const jwtPayload = {
        userEmail: user.email,
        role: user.role,
    };

    const accessToken = createToken(
        jwtPayload,
        config.jwt_access_secret as string,
        config.jwt_access_expires_in as string,
    );

    return {
        accessToken,
    };
};

const googleSignIn = async (idToken: string) => {
    try {
        const decodedToken = await admin.auth().verifyIdToken(idToken);
        const { email, name, picture: image } = decodedToken;

        // Check if user exists
        let user = await User.isUserExistsByEmail(email as string);

        if (!user) {
            // Create a new user without a password
            //  @ts-ignore
            user = await User.create({ email, name, image });
        }

        // Generate tokens as before
        const jwtPayload = {
            userEmail: user.email,
            role: user.role,
        };

        const accessToken = createToken(
            jwtPayload,
            config.jwt_access_secret as string,
            config.jwt_access_expires_in as string,
        );

        const refreshToken = createToken(
            jwtPayload,
            config.jwt_refresh_secret as string,
            config.jwt_refresh_expires_in as string,
        );

        return { accessToken, refreshToken, user };
    } catch (error) {
        console.error('Error in googleSignIn:', error);
        throw new AppError(httpStatus.UNAUTHORIZED, 'Invalid Google token');
    }
};

export const AuthServices = {
    loginUser,
    signupUser,
    refreshToken,
    googleSignIn,
};
