import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt.util';
import { AppError } from './error.middleware';

export const authMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AppError('No token provided. Authorization denied.', 401);
    }

    const token = authHeader.split(' ')[1]!;
    const decoded = verifyToken(token) as Express.Request['user'];
    req.user = decoded;

    // Multi-tenant requirement: every request must carry a company_id
    if (!req.user?.company_id) {
      throw new AppError('Invalid token. Company ID missing.', 401);
    }

    next();
  } catch (error) {
    next(new AppError('Invalid or expired token', 401));
  }
};
