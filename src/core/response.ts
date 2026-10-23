import type { Response } from 'express';
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    totalPages?: number;
    [key: string]: unknown;
  };
  error?: {
    code: string;
    message: string;
    details?: unknown;
  };
  timestamp: string;
}

export function sendSuccess<T>(
  res: Response,
  data: T,
  message?: string,
  statusCode = 200,
  meta?: ApiResponse<T>['meta']
): Response {
  return res.status(statusCode).json({
    success: true,
    data,
    ...(message ? { message } : {}),
    ...(meta ? { meta } : {}),
    timestamp: new Date().toISOString(),
  });
}

export function sendError(
  res: Response,
  statusCode: number,
  message: string,
  code = 'ERROR',
  details?: unknown
): Response {
  return res.status(statusCode).json({
    success: false,
    error: {
      code,
      message,
      ...(details !== undefined ? { details } : {}),
    },
    timestamp: new Date().toISOString(),
  });
}