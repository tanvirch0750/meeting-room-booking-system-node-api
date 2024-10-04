import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { userValidations } from '../user/user.validation';
import { AuthControllers } from './auth.controller';
import { AuthValidation } from './auth.validation';

const router = express.Router();

router.post(
    '/signup',
    validateRequest(userValidations.createUserValidationSchema),
    AuthControllers.signupUser,
);

router.post(
    '/login',
    validateRequest(AuthValidation.loginValidationSchema),
    AuthControllers.loginUser,
);

router.post(
    '/google-login',

    AuthControllers.googleSignIn,
);

router.post(
    '/refresh-token',
    // validateRequest(AuthValidation.refreshTokenValidationSchema),
    AuthControllers.refreshToken,
);

export const authRoutes = router;
