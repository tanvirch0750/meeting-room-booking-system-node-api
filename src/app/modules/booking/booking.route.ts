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

// Define the route for retrieving all bookings
router.get('/', auth(USER_ROLE.admin), bookingController.getAllBookings);

// // Define the route for retrieving all bookings by user
// router.get('/', auth(USER_ROLE.user), bookingController.getBookingsByUser);

// Define the route for deleting a booking by its ID
router.delete('/:id', auth(USER_ROLE.admin), bookingController.deleteBooking);

// Define the route for updating a room by its ID
router.put(
    '/:id',
    auth(USER_ROLE.admin),
    validateRequest(bookingValidations.updateBookinglidationSchema),
    bookingController.updateBooking,
);

// Export the router as ProductRoutes
export const bookingRoutes = router;
