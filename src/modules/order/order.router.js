import {Router} from 'express';
import { isAuthentication } from '../../middleware/authentication.middleware.js';
import { isValid } from '../../middleware/validation.middleware.js';
import { createOrderSchema } from './order.validation.js';
import { createOrder } from './order.controller.js';

const router = Router();

router.use(isAuthentication);

// create order
router.post('/',isValid(createOrderSchema), createOrder);


export default router

