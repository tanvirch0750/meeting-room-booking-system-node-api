import express from 'express';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { USER_ROLE } from '../user/user.constant';
import { slotController } from './slot.controller';
import { slotValidations } from './slot.validation';

// Create a new router instance
const router = express.Router();

// Define the route for creating a new room
router.post(
    '/',
    auth(USER_ROLE.admin),
    validateRequest(slotValidations.createSlotValidationSchema),
    slotController.createSlot,
);

router.get('/availability', slotController.getAvailableSlots);

// Export the router as ProductRoutes
export const slotRoutes = router;
