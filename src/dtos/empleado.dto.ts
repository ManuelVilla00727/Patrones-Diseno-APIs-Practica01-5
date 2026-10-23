import { z } from 'zod';

export const createEmpleadoSchema = z
  .object({
    nombre: z
      .string()
      .trim()
      .min(3, 'El nombre debe tener al menos 3 caracteres')
      .max(80, 'El nombre no puede exceder 80 caracteres'),
    cargo: z
      .string()
      .trim()
      .min(2, 'El cargo debe tener al menos 2 caracteres')
      .max(60, 'El cargo no puede exceder 60 caracteres'),
    departamento: z
      .string()
      .trim()
      .min(2, 'El departamento debe tener al menos 2 caracteres'),
    sueldo: z
      .number()
      .gt(0, 'El sueldo debe ser un valor estrictamente positivo mayor a 0')
      .max(200000, 'El sueldo excede el límite máximo permitido'),
  })
  .strict(); // Rechaza inyección de propiedades espurias/no autorizadas

export const updateEmpleadoSchema = createEmpleadoSchema.partial().refine(
  (data) => Object.keys(data).length > 0,
  { message: 'Debe proporcionar al menos un campo para actualizar' }
);

export const idParamSchema = z.object({
  id: z
    .string()
    .trim()
    .min(1, 'El ID no puede estar vacío')
    .regex(/^[a-zA-Z0-9_-]{3,64}$/, 'El identificador debe ser alfanumérico válido'),
});

export const listQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(10),
  search: z.string().trim().optional(),
  departamento: z.string().trim().optional(),
});

export type CreateEmpleadoDTO = z.infer<typeof createEmpleadoSchema>;
export type UpdateEmpleadoDTO = z.infer<typeof updateEmpleadoSchema>;
export type ListQueryDTO = z.infer<typeof listQuerySchema>;