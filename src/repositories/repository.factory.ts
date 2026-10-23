import type { IEmpleadoRepository } from './empleado.repository.interface';
import { InMemoryEmpleadoRepository } from './in-memory-empleado.repository';

export class EmpleadoRepositoryFactory {
  private static instance: IEmpleadoRepository;

  public static getRepository(): IEmpleadoRepository {
    if (!this.instance) {
      // Activa InMemory para garantizar funcionamiento instantáneo sin MongoDB
      this.instance = new InMemoryEmpleadoRepository();
    }
    return this.instance;
  }
}