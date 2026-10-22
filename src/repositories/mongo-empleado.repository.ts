import mongoose, { Schema, Document, Model } from 'mongoose';
import type { IEmpleadoRepository, EmpleadoEntity, PaginatedResult } from './empleado.repository.interface';
import type { CreateEmpleadoDTO, UpdateEmpleadoDTO, ListQueryDTO } from '../dtos/empleado.dto';

export interface EmpleadoDoc extends Document {
  nombre: string;
  cargo: string;
  departamento: string;
  sueldo: number;
  createdAt: Date;
  updatedAt: Date;
}

const EmpleadoSchema = new Schema<EmpleadoDoc>(
  {
    nombre: { type: String, required: true, trim: true },
    cargo: { type: String, required: true, trim: true },
    departamento: { type: String, required: true, trim: true },
    sueldo: { type: Number, required: true },
  },
  { timestamps: true, versionKey: false }
);

const EmpleadoModel: Model<EmpleadoDoc> =
  mongoose.models.Empleado || mongoose.model<EmpleadoDoc>('Empleado', EmpleadoSchema);

export class MongoEmpleadoRepository implements IEmpleadoRepository {
  public getProviderName(): string {
    return 'MongoDB Mongoose Repository';
  }

  private mapToEntity(doc: EmpleadoDoc): EmpleadoEntity {
    return {
      _id: (doc._id as string).toString(),
      nombre: doc.nombre,
      cargo: doc.cargo,
      departamento: doc.departamento,
      sueldo: doc.sueldo,
      createdAt: doc.createdAt?.toISOString() ?? new Date().toISOString(),
      updatedAt: doc.updatedAt?.toISOString() ?? new Date().toISOString(),
    };
  }

  public async findAll(options: ListQueryDTO): Promise<PaginatedResult<EmpleadoEntity>> {
    const filter: Record<string, unknown> = {};
    if (options.departamento) filter.departamento = new RegExp(`^${options.departamento}$`, 'i');
    if (options.search) {
      filter.$or = [
        { nombre: { $regex: options.search, $options: 'i' } },
        { cargo: { $regex: options.search, $options: 'i' } },
      ];
    }

    const page = options.page || 1;
    const limit = options.limit || 10;
    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      EmpleadoModel.find(filter).skip(skip).limit(limit).exec(),
      EmpleadoModel.countDocuments(filter).exec(),
    ]);

    return {
      items: items.map((doc) => this.mapToEntity(doc)),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit) || 1,
    };
  }

  public async findById(id: string): Promise<EmpleadoEntity | null> {
    if (!mongoose.Types.ObjectId.isValid(id)) return null;
    const doc = await EmpleadoModel.findById(id).exec();
    return doc ? this.mapToEntity(doc) : null;
  }

  public async create(data: CreateEmpleadoDTO): Promise<EmpleadoEntity> {
    const doc = await EmpleadoModel.create(data);
    return this.mapToEntity(doc);
  }

  public async update(id: string, data: UpdateEmpleadoDTO): Promise<EmpleadoEntity | null> {
    if (!mongoose.Types.ObjectId.isValid(id)) return null;
    const doc = await EmpleadoModel.findByIdAndUpdate(id, data, { new: true }).exec();
    return doc ? this.mapToEntity(doc) : null;
  }

  public async delete(id: string): Promise<boolean> {
    if (!mongoose.Types.ObjectId.isValid(id)) return false;
    const res = await EmpleadoModel.findByIdAndDelete(id).exec();
    return res !== null;
  }

  public async seedDemo(): Promise<number> {
    return EmpleadoModel.countDocuments();
  }
}