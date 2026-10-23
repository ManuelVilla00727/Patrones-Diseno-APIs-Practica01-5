import express from 'express';
import { EmpleadoController } from '../controllers/empleados.controllers';
import { EmpleadoService } from '../services/empleado.service';
import { EmpleadoRepositoryFactory } from '../repositories/repository.factory';
import { validateRequest } from '../middlewares/validation.middleware';
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

  router.get('/', validateRequest({ query: listQuerySchema }), controller.getEmpleados);
  router.post('/', validateRequest({ body: createEmpleadoSchema }), controller.createEmpleado);
  router.get('/:id', validateRequest({ params: idParamSchema }), controller.getEmpleadoById);
  router.put('/:id', validateRequest({ params: idParamSchema, body: updateEmpleadoSchema }), controller.updateEmpleado);
  router.delete('/:id', validateRequest({ params: idParamSchema }), controller.deleteEmpleado);

  return router;
}