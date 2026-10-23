import type { IEmpleadoRepository, EmpleadoEntity, PaginatedResult } from './empleado.repository.interface';
import type { CreateEmpleadoDTO, UpdateEmpleadoDTO, ListQueryDTO } from '../dtos/empleado.dto';

export class InMemoryEmpleadoRepository implements IEmpleadoRepository {
  private employees: Map<string, EmpleadoEntity> = new Map();

  constructor() {
    this.seedDemo();
  }

  public getProviderName(): string {
    return 'In-Memory Repository (Desacoplado - Aislado de ODM)';
  }

  public async seedDemo(): Promise<number> {
    this.employees.clear();
    const defaults = [
      { nombre: 'Ing. Carlos Mendoza', cargo: 'Arquitecto Cloud', departamento: 'Tecnología', sueldo: 3850 },
      { nombre: 'Dra. Elena Vasconez', cargo: 'Directora Talento Humano', departamento: 'Recursos Humanos', sueldo: 3200 },
      { nombre: 'Lic. Mateo Paredes', cargo: 'Auditor Financiero', departamento: 'Finanzas', sueldo: 2750 },
      { nombre: 'Ing. Sofía Benítez', cargo: 'Líder NodeJS', departamento: 'Tecnología', sueldo: 3400 },
    ];
    defaults.forEach((d, i) => {
      const id = `6ac66740000000000000000${i + 1}`;
      this.employees.set(id, {
        _id: id,
        ...d,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    });
    return this.employees.size;
  }

  public async findAll(options: ListQueryDTO): Promise<PaginatedResult<EmpleadoEntity>> {
    let list = Array.from(this.employees.values());
    if (options.search) {
      const term = options.search.toLowerCase();
      list = list.filter((e) => e.nombre.toLowerCase().includes(term) || e.cargo.toLowerCase().includes(term));
    }
    if (options.departamento) {
      list = list.filter((e) => e.departamento.toLowerCase() === options.departamento!.toLowerCase());
    }
    const page = options.page || 1;
    const limit = options.limit || 10;
    return {
      items: list.slice((page - 1) * limit, page * limit),
      total: list.length,
      page,
      limit,
      totalPages: Math.ceil(list.length / limit) || 1,
    };
  }

  public async findById(id: string): Promise<EmpleadoEntity | null> {
    const e = this.employees.get(id);
    return e ? { ...e } : null;
  }

  public async create(data: CreateEmpleadoDTO): Promise<EmpleadoEntity> {
    const id = `6ac66740${Date.now().toString(16)}`;
    const entity: EmpleadoEntity = {
      _id: id,
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.employees.set(id, entity);
    return { ...entity };
  }

  public async update(id: string, data: UpdateEmpleadoDTO): Promise<EmpleadoEntity | null> {
    const existing = this.employees.get(id);
    if (!existing) return null;
    const updated = { ...existing, ...data, updatedAt: new Date().toISOString() };
    this.employees.set(id, updated);
    return { ...updated };
  }

  public async delete(id: string): Promise<boolean> {
    return this.employees.delete(id);
  }
}