import { Request, Response, NextFunction } from 'express';
import { NotAuthorizedError } from '../errors/not-authorized-error';
import { UserStatus } from '../types/user-status';
import { BadRequestError } from '../errors/bad-request-error';

export const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  if (!req.currentUser) {
    throw new NotAuthorizedError();
  }

  if (req.currentUser.status === UserStatus.Suspended) {
    throw new BadRequestError('Your account has been suspended');
  }

  next();
};
