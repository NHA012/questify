import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { UserRole } from '../types/user-roles';
import { UserStatus } from '../types/user-status';

interface UserPayload {
  id: string;
  email: string;
  userName: string;
  role: UserRole;
  status: UserStatus;
  userExp: number;
}

declare module 'express-serve-static-core' {
  interface Request {
    currentUser?: UserPayload;
  }
}

export const currentUser = (req: Request, res: Response, next: NextFunction) => {
  if (!req.session?.jwt) {
    return next();
  }

  try {
    const payload = jwt.verify(req.session.jwt, process.env.JWT_KEY!) as UserPayload;
    req.currentUser = payload;
  } catch (err) {
    console.log(err);
  }

  next();
};
