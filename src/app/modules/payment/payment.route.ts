import express from 'express';

import { paymentControler } from './payment.controller';

const router = express.Router();

router.post('/confirmation', paymentControler.confirmationController);

// Export the router as ProductRoutes
export const paymentRoutes = router;
