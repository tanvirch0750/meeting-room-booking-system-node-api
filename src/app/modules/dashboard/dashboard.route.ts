import express from 'express';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../user/user.constant';
import { dashboardController } from './dashboard.controller';

const router = express.Router();

router.get('/', auth(USER_ROLE.admin), dashboardController.getDashboardData);

// Export the router as ProductRoutes
export const dashboardRoutes = router;
