import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { validateRequest } from '../middleware/validateRequest';
import { authValidation } from '../validations/auth.validation';

const router = Router();

router.post('/register', validateRequest(authValidation.register), AuthController.register);
router.post('/login', validateRequest(authValidation.login), AuthController.login);
router.post('/logout', AuthController.logout);

export const authRoutes = router;