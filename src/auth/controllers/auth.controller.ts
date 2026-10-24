import type { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import type { IAuthRepository } from '../repositories/auth.repository.interface.js';

export class AuthController {
  constructor(private authRepository: IAuthRepository) {}

  login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { email, password } = req.body;
      const SECRET_KEY = process.env.JWT_SECRET || 'MIS_LLAVE_SECRETA';

      const user = await this.authRepository.findByEmail(email);
      if (!user) {
        res.status(401).json({ success: false, error: { message: 'Credenciales inválidas', code: 'AUTH_FAILED' } });
        return;
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        res.status(401).json({ success: false, error: { message: 'Credenciales inválidas', code: 'AUTH_FAILED' } });
        return;
      }

      const token = jwt.sign({ id: user._id, rol: user.rol }, SECRET_KEY, { expiresIn: '2h' });

      res.status(200).json({
        success: true,
        data: { token, user: { email: user.email, rol: user.rol } }
      });
    } catch (error) {
      next(error);
    }
  };
}