import express from 'express';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { USER_ROLE } from '../user/user.constant';
import { bookingController } from './booking.controller';
import { bookingValidations } from './booking.validation';

// Create a new router instance
const router = express.Router();

// Define the route for creating a new room
router.post(
    '/',
    auth(USER_ROLE.user),
    validateRequest(bookingValidations.createBookingValidationSchema),
    bookingController.createBooking,
);

// Export the router as ProductRoutes
export const bookingRoutes = router;
