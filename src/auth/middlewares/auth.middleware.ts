import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface IAuthRequest extends Request {
  user?: { id: string; rol: string };
}

export const authenticateJWT = (req: IAuthRequest, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;
  const SECRET_KEY = process.env.JWT_SECRET || 'MIS_LLAVE_SECRETA';

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({
      success: false,
      error: { message: 'Acceso denegado: Token no proporcionado', code: 'UNAUTHORIZED' }
    });
    return;
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, SECRET_KEY) as { id: string; rol: string };
    req.user = decoded;
    next();
  } catch (error) {
    res.status(403).json({
      success: false,
      error: { message: 'Token inválido o expirado', code: 'FORBIDDEN' }
    });
  }
};