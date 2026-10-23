import type { CreateEmpleadoDTO, UpdateEmpleadoDTO, ListQueryDTO } from '../dtos/empleado.dto';

export interface EmpleadoEntity {
  _id: string;
  nombre: string;
  cargo: string;
  departamento: string;
  sueldo: number;
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface IEmpleadoRepository {
  findAll(options: ListQueryDTO): Promise<PaginatedResult<EmpleadoEntity>>;
  findById(id: string): Promise<EmpleadoEntity | null>;
  create(data: CreateEmpleadoDTO): Promise<EmpleadoEntity>;
  update(id: string, data: UpdateEmpleadoDTO): Promise<EmpleadoEntity | null>;
  delete(id: string): Promise<boolean>;
  seedDemo(): Promise<number>;
  getProviderName(): string;
}