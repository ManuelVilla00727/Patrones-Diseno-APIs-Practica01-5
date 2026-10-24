import express from 'express';
import { EmpleadoController } from '../controllers/empleados.controllers';
import { EmpleadoService } from '../services/empleado.service';
import { EmpleadoRepositoryFactory } from '../repositories/repository.factory';
import { validateRequest } from '../middlewares/validation.middleware';
import { authenticateJWT } from '../middlewares/auth.middleware.js';
import {
  createEmpleadoSchema,
  updateEmpleadoSchema,
  idParamSchema,
  listQuerySchema,
} from '../dtos/empleado.dto';

export function createEmpleadoRouter(): express.Router {
  const router = express.Router();
  const repository = EmpleadoRepositoryFactory.getRepository();
  const service = new EmpleadoService(repository);
  const controller = new EmpleadoController(service);

  // GET: Abierto (cualquiera puede ver la lista)
  router.get('/', validateRequest({ query: listQuerySchema }), controller.getEmpleados);
  router.get('/:id', validateRequest({ params: idParamSchema }), controller.getEmpleadoById);

  // POST, PUT, DELETE: Protegidos con JWT (solo usuarios autenticados)
  router.post('/', authenticateJWT, validateRequest({ body: createEmpleadoSchema }), controller.createEmpleado);
  router.put('/:id', authenticateJWT, validateRequest({ params: idParamSchema, body: updateEmpleadoSchema }), controller.updateEmpleado);
  router.delete('/:id', authenticateJWT, validateRequest({ params: idParamSchema }), controller.deleteEmpleado);

  return router;
}