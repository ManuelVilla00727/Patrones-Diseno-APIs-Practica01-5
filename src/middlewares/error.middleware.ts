import type { Request, Response, NextFunction } from 'express';
import { AppError } from '../core/errors';
import { sendError } from '../core/response';

export function errorHandlerMiddleware(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  if (err instanceof AppError) {
    sendError(res, err.statusCode, err.message, err.code, err.details);
    return;
  }
  console.error('[Unhandled Error Intercepted]:', err);
  // Devuelve el mensaje real del error para depuración
  sendError(res, 500, err.message || 'Error interno del servidor', 'INTERNAL_SERVER_ERROR', { stack: err.stack });
}