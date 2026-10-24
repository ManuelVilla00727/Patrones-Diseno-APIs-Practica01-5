import { Router } from 'express';
import { MongoDBRepository } from '../repositories/mongo-auth.repository.js';
import { AuthController } from '../controllers/auth.controller.js';
import { validateRequest } from '../../middlewares/validation.middleware.js';
import { LoginSchema } from '../dtos/auth.dto.js';

const router = Router();
const authRepository = new MongoDBRepository();
const authController = new AuthController(authRepository);

// Endpoint de login blindado con el DTO de Zod
router.post('/login', validateRequest({ body: LoginSchema }), authController.login);

export default router;