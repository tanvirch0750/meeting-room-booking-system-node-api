import express from 'express';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { USER_ROLE } from '../user/user.constant';
import { reviewControllers } from './reviews.controller';
import { reviewValidations } from './reviews.validation';

const router = express.Router();

router.post(
    '/',
    auth(USER_ROLE.user, USER_ROLE.admin),
    validateRequest(reviewValidations.createReviewValidationSchema),
    reviewControllers.createReview,
);

router.get('/', reviewControllers.getAllReviews);

router.get('/room/:id', reviewControllers.getReviewsByRoomId);

router.get('/review-stat/:id', reviewControllers.getReviewStatsBySingleRoom);

router.get('/:id', reviewControllers.getSingleReview);

router.delete('/:id', auth(USER_ROLE.admin), reviewControllers.deleteReview);

router.put(
    '/:id',
    auth(USER_ROLE.admin, USER_ROLE.user),
    validateRequest(reviewValidations.updateReviewValidationSchema),
    reviewControllers.updateReview,
);

// Export the router as ProductRoutes
export const reviewRoutes = router;
