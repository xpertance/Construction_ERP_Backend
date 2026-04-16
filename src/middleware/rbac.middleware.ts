import { Request, Response, NextFunction } from 'express';
import { AppError } from './error.middleware';

export const allowPermissions = (requiredPermission: string) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      const user = req.user;

      if (!user) {
        throw new AppError('User not authenticated', 401);
      }

      // Permissions are embedded in the JWT payload
      const userPermissions: string[] = user.permissions || [];

      if (userPermissions.includes('*') || userPermissions.includes(requiredPermission)) {
        return next();
      }

      throw new AppError('Forbidden: You do not have the required permissions.', 403);
    } catch (error) {
      next(error);
    }
  };
};
