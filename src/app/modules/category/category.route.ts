import express from 'express';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { USER_ROLE } from '../user/user.constant';
import { categoryControllers } from './category.controller';
import { categoryValidations } from './category.validation';

const router = express.Router();

router.post(
    '/',
    auth(USER_ROLE.admin),
    validateRequest(categoryValidations.createCategoryValidationSchema),
    categoryControllers.createCategory,
);

router.get('/', categoryControllers.getAllCategories);

router.get('/:id', categoryControllers.getSingleCategory);

router.delete(
    '/:id',
    auth(USER_ROLE.admin),
    categoryControllers.deleteCategory,
);

router.put(
    '/:id',
    auth(USER_ROLE.admin),
    validateRequest(categoryValidations.updateCategoryValidationSchema),
    categoryControllers.updateCategory,
);

// Export the router as ProductRoutes
export const categoryRoutes = router;
