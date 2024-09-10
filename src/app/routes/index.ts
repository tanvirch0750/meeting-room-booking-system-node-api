import { Router } from 'express';
import { authRoutes } from '../modules/auth/auth.route';
import { bookingRoutes } from '../modules/booking/booking.route';
import { myBookingRoutes } from '../modules/booking/my-booking.route';
import { categoryRoutes } from '../modules/category/category.route';
import { cqRoutes } from '../modules/customer-query/cq.route';
import { dashboardRoutes } from '../modules/dashboard/dashboard.route';
import { paymentRoutes } from '../modules/payment/payment.route';
import { reviewRoutes } from '../modules/reviews/reviews.route';
import { roomRoutes } from '../modules/room/room.route';
import { slotRoutes } from '../modules/slot/slot.route';
import { userRoutes } from '../modules/user/user.route';

const router = Router();

const moduleRoutes = [
    {
        path: '/auth',
        route: authRoutes,
    },
    {
        path: '/user',
        route: userRoutes,
    },
    {
        path: '/category',
        route: categoryRoutes,
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
    {
        path: '/review',
        route: reviewRoutes,
    },
    {
        path: '/customer-query',
        route: cqRoutes,
    },
    {
        path: '/payment',
        route: paymentRoutes,
    },
    {
        path: '/dashboard',
        route: dashboardRoutes,
    },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
