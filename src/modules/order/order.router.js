import {Router} from 'express';
import { isAuthentication } from '../../middleware/authentication.middleware.js';
import { isValid } from '../../middleware/validation.middleware.js';
import { cancelOrderSchema, createOrderSchema } from './order.validation.js';
import { cancelOrder, createOrder } from './order.controller.js';

const router = Router();

router.use(isAuthentication);

// create order
router.post('/',isValid(createOrderSchema), createOrder);
router.patch('/:orderId',isValid(cancelOrderSchema), cancelOrder);


export default router

