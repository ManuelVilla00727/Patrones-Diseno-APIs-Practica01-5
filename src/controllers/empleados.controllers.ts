import type { Request, Response, NextFunction } from 'express';
import { EmpleadoService } from '../services/empleado.service';
import { sendSuccess } from '../core/response';
import type { ListQueryDTO, CreateEmpleadoDTO, UpdateEmpleadoDTO } from '../dtos/empleado.dto';

export class EmpleadoController {
  constructor(private readonly service: EmpleadoService) {}

  public getEmpleados = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.service.listar(req.query as unknown as ListQueryDTO);
      sendSuccess(res, result.items, 'Listado de empleados obtenido exitosamente', 200, {
        page: result.page,
        limit: result.limit,
        total: result.total,
        totalPages: result.totalPages,
        proveedor: this.service.getProveedorPersistencia(),
      });
    } catch (error) {
      next(error);
    }
  };

  public getEmpleadoById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const empleado = await this.service.obtenerPorId(id);
      sendSuccess(res, empleado, `Empleado con ID ${id} recuperado`);
    } catch (error) {
      next(error);
    }
  };

  public createEmpleado = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const dto = req.body as CreateEmpleadoDTO;
      const nuevo = await this.service.registrar(dto);
      sendSuccess(res, nuevo, 'Empleado registrado exitosamente', 201);
    } catch (error) {
      next(error);
    }
  };

  public updateEmpleado = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const dto = req.body as UpdateEmpleadoDTO;
      const actualizado = await this.service.actualizar(id, dto);
      sendSuccess(res, actualizado, 'Empleado actualizado exitosamente');
    } catch (error) {
      next(error);
    }
  };

  public deleteEmpleado = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      await this.service.eliminar(id);
      sendSuccess(res, { id, eliminado: true }, 'Empleado eliminado satisfactoriamente');
    } catch (error) {
      next(error);
    }
  };
}
