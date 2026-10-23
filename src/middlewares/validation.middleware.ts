import type { Request, Response, NextFunction } from 'express';
import { z, ZodError } from 'zod';
import { ValidationError } from '../core/errors';

export function validateRequest(schemas: { body?: z.ZodTypeAny; params?: z.ZodTypeAny; query?: z.ZodTypeAny }) {
  return async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
    try {
      if (schemas.params && req.params) {
        const parsedParams = await schemas.params.parseAsync(req.params);
        Object.assign(req.params, parsedParams);
      }
      if (schemas.query && req.query) {
        const parsedQuery = await schemas.query.parseAsync(req.query);
        Object.assign(req.query, parsedQuery);
      }
      if (schemas.body && req.body) {
        req.body = await schemas.body.parseAsync(req.body);
      }
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const issues = (error as any).issues || (error as any).errors || [];
        const details = issues.map((i: any) => ({
          campo: Array.isArray(i.path) ? i.path.join('.') : String(i.path),
          mensaje: i.message,
          codigo: i.code,
        }));
        next(new ValidationError('Validación perimetral fallida', details));
      } else {
        next(error);
      }
    }
  };
}