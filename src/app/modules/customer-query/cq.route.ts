import express from 'express';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { USER_ROLE } from '../user/user.constant';
import { cqControllers } from './cq.controller';
import { cqValidations } from './cq.validation';

const router = express.Router();

router.post(
    '/',

    validateRequest(cqValidations.createCqValidationSchema),
    cqControllers.createCq,
);

router.get('/', auth(USER_ROLE.admin), cqControllers.getAllCqs);

router.get('/:id', auth(USER_ROLE.admin), cqControllers.getSingleCq);

router.delete('/:id', auth(USER_ROLE.admin), cqControllers.deleteCq);

router.put(
    '/:id',
    auth(USER_ROLE.admin),
    validateRequest(cqValidations.updateQcValidationSchema),
    cqControllers.updateCq,
);

// Export the router as ProductRoutes
export const cqRoutes = router;
