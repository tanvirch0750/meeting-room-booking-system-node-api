import { Router } from 'express';
import { authRoutes } from '../modules/auth/auth.route';
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
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
