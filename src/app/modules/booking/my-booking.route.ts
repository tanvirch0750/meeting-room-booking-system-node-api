import express from 'express';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../user/user.constant';
import { bookingController } from './booking.controller';

// Create a new router instance
const router = express.Router();

// Define the route for retrieving all bookings by user
router.get('/', auth(USER_ROLE.user), bookingController.getBookingsByUser);

// Export the router as ProductRoutes
export const myBookingRoutes = router;
