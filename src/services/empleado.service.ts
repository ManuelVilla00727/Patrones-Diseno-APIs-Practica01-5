import type { IEmpleadoRepository, EmpleadoEntity, PaginatedResult } from '../repositories/empleado.repository.interface';
import type { CreateEmpleadoDTO, UpdateEmpleadoDTO, ListQueryDTO } from '../dtos/empleado.dto';
import { NotFoundError } from '../core/errors';

export class EmpleadoService {
  constructor(private readonly repository: IEmpleadoRepository) {}

  public async listar(query: ListQueryDTO): Promise<PaginatedResult<EmpleadoEntity>> {
    return this.repository.findAll(query);
  }

  public async obtenerPorId(id: string): Promise<EmpleadoEntity> {
    const emp = await this.repository.findById(id);
    if (!emp) throw new NotFoundError(`Empleado con ID ${id} no encontrado`);
    return emp;
  }

  public async registrar(data: CreateEmpleadoDTO): Promise<EmpleadoEntity> {
    return this.repository.create(data);
  }

  public async actualizar(id: string, data: UpdateEmpleadoDTO): Promise<EmpleadoEntity> {
    const actualizado = await this.repository.update(id, data);
    if (!actualizado) throw new NotFoundError(`No se pudo actualizar: el ID ${id} no existe`);
    return actualizado;
  }

  public async eliminar(id: string): Promise<boolean> {
    const eliminado = await this.repository.delete(id);
    if (!eliminado) throw new NotFoundError(`No se pudo eliminar: el ID ${id} no existe`);
    return true;
  }

  public async reiniciarDatos(): Promise<number> {
    return this.repository.seedDemo();
  }

  public getProveedorPersistencia(): string {
    return this.repository.getProviderName();
  }
}