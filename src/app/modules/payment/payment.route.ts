import express from 'express';

import { paymentControler } from './payment.controller';

const router = express.Router();

router.post('/confirmation', paymentControler.confirmationController);
router.post('/failed', paymentControler.failedController);

// Export the router as ProductRoutes
export const paymentRoutes = router;
