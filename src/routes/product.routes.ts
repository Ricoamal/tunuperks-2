import { Router } from 'express';
import { ProductController } from '../controllers/product.controller';
import { protect, restrictTo } from '../middleware/auth';
import { validateRequest } from '../middleware/validateRequest';
import { productValidation } from '../validations/product.validation';

const router = Router();

router
  .route('/')
  .get(ProductController.getAllProducts)
  .post(
    protect,
    restrictTo('admin'),
    validateRequest(productValidation.createProduct),
    ProductController.createProduct
  );

router
  .route('/:id')
  .get(ProductController.getProduct)
  .patch(
    protect,
    restrictTo('admin'),
    validateRequest(productValidation.updateProduct),
    ProductController.updateProduct
  )
  .delete(protect, restrictTo('admin'), ProductController.deleteProduct);

export const productRoutes = router;