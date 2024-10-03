import express from 'express';
import auth from '../../middlewares/auth';
import { USER_ROLE } from './user.constant';
import { userControllers } from './user.controller';

const router = express.Router();

router.get('/', auth(USER_ROLE.admin), userControllers.getAllUsers);

router.get(
    '/profile',
    auth(USER_ROLE.admin, USER_ROLE.user),

    userControllers.getProfileData,
);

router.get('/:id', userControllers.getSingleUser);

router.put(
    '/:id',
    auth(USER_ROLE.admin, USER_ROLE.user),

    userControllers.updateUser,
);

// Export the router as ProductRoutes
export const userRoutes = router;
