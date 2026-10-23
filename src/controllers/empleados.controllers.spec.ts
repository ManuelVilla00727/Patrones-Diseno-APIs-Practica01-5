import { jest } from '@jest/globals';
import type { Request, Response, NextFunction } from 'express';
import { EmpleadoController } from './empleados.controllers.js';
import type { EmpleadoService } from '../services/empleado.service.js';

describe('Unit Test: EmpleadoController (Mantenibilidad & Testabilidad)', () => {
  let controller: EmpleadoController;
  let mockService: jest.Mocked<EmpleadoService>;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: NextFunction;
  let statusMock: jest.Mock;
  let jsonMock: jest.Mock;

  beforeEach(() => {
    // 1. Crear un Mock 100% aislado del servicio (Cero dependencia de Mongoose)
    mockService = {
      listar: jest.fn(),
      obtenerPorId: jest.fn(),
      registrar: jest.fn(),
      actualizar: jest.fn(),
      eliminar: jest.fn(),
      getProveedorPersistencia: jest.fn().mockReturnValue('MOCK'),
    } as unknown as jest.Mocked<EmpleadoService>;

    controller = new EmpleadoController(mockService);

    // 2. Mockear los objetos del ciclo de vida de Express
    jsonMock = jest.fn();
    statusMock = jest.fn().mockReturnValue({ json: jsonMock });
    mockResponse = { status: statusMock };
    mockNext = jest.fn();
  });

  it('Debería retornar un estado 200 y la lista de empleados de la abstracción', async () => {
    const fakeResult = {
      items: [
        { id: '1', nombre: 'Andrés Mendoza', cargo: 'Arquitecto', departamento: 'TI', sueldo: 4000 },
      ],
      page: 1,
      limit: 10,
      total: 1,
      totalPages: 1,
    };

    mockService.listar.mockResolvedValue(fakeResult as any);

    mockRequest = { query: {} };

    await controller.getEmpleados(
      mockRequest as Request,
      mockResponse as Response,
      mockNext
    );

    expect(statusMock).toHaveBeenCalledWith(200);
    expect(jsonMock).toHaveBeenCalledWith(
      expect.objectContaining({
        success: true,
        message: 'Listado de empleados obtenido exitosamente',
        data: fakeResult.items,
        meta: expect.objectContaining({
          page: 1,
          limit: 10,
          total: 1,
          totalPages: 1,
          proveedor: 'MOCK',
        }),
      })
    );
    expect(mockService.listar).toHaveBeenCalledTimes(1);
  });

  it('Debería retornar un estado 201 al crear un empleado', async () => {
    const fakeEmpleado = {
      id: '1',
      nombre: 'Andrés Mendoza',
      cargo: 'Arquitecto',
      departamento: 'TI',
      sueldo: 4000,
    };

    mockService.registrar.mockResolvedValue(fakeEmpleado as any);

    mockRequest = {
      body: {
        nombre: 'Andrés Mendoza',
        cargo: 'Arquitecto',
        departamento: 'TI',
        sueldo: 4000,
      },
    };

    await controller.createEmpleado(
      mockRequest as Request,
      mockResponse as Response,
      mockNext
    );

    expect(statusMock).toHaveBeenCalledWith(201);
    expect(jsonMock).toHaveBeenCalledWith(
      expect.objectContaining({
        success: true,
        message: 'Empleado registrado exitosamente',
        data: fakeEmpleado,
      })
    );
    expect(mockService.registrar).toHaveBeenCalledTimes(1);
  });
});