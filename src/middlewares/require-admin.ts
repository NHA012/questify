import { Request, Response, NextFunction } from 'express';
import { NotAuthorizedError } from '../errors/not-authorized-error';
import { UserRole } from '../types/user-roles';

export const requireAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (!req.currentUser || req.currentUser.role !== UserRole.Admin) {
    throw new NotAuthorizedError();
  }

  next();
};
