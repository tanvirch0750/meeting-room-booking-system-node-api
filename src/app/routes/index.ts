import { Router } from 'express';
import { authRoutes } from '../modules/auth/auth.route';
import { bookingRoutes } from '../modules/booking/booking.route';
import { myBookingRoutes } from '../modules/booking/my-booking.route';
import { roomRoutes } from '../modules/room/room.route';
import { slotRoutes } from '../modules/slot/slot.route';

const router = Router();

const moduleRoutes = [
    {
        path: '/auth',
        route: authRoutes,
    },
    {
        path: '/rooms',
        route: roomRoutes,
    },
    {
        path: '/slots',
        route: slotRoutes,
    },
    {
        path: '/bookings',
        route: bookingRoutes,
    },
    {
        path: '/my-bookings',
        route: myBookingRoutes,
    },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
