import express from 'express';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { USER_ROLE } from '../user/user.constant';
import { roomControllers } from './room.controller';
import { roomValidations } from './room.validation';

// Create a new router instance
const router = express.Router();

// Define the route for creating a new room
router.post(
    '/',
    auth(USER_ROLE.admin),
    validateRequest(roomValidations.createRoomValidationSchema),
    roomControllers.createRoom,
);

// Define the route for retrieving all rooms
router.get('/', roomControllers.getAllRooms);

// Define the route for retrieving a single room by its ID
router.get('/:id', roomControllers.getSingleRoom);

// Define the route for deleting a room by its ID
router.delete('/:id', auth(USER_ROLE.admin), roomControllers.deleteRoom);

// Define the route for updating a room by its ID
router.put(
    '/:id',
    auth(USER_ROLE.admin),
    validateRequest(roomValidations.updateRoomalidationSchema),
    roomControllers.updateRoom,
);

// Export the router as ProductRoutes
export const roomRoutes = router;
