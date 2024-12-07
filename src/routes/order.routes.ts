import { Router } from 'express';
import { OrderController } from '../controllers/order.controller';
import { protect } from '../middleware/auth';
import { validateRequest } from '../middleware/validateRequest';
import { orderValidation } from '../validations/order.validation';

const router = Router();

router.use(protect);

router
  .route('/')
  .get(OrderController.getMyOrders)
  .post(validateRequest(orderValidation.createOrder), OrderController.createOrder);

router.route('/:id').get(OrderController.getOrder);

router.post(
  '/:id/pay',
  validateRequest(orderValidation.processPayment),
  OrderController.processPayment
);

export const orderRoutes = router;