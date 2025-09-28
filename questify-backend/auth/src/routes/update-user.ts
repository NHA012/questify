import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import {
  validateRequest,
  NotFoundError,
  BadRequestError,
  NotAuthorizedError,
  UserRole,
  currentUser,
} from '@datn242/questify-common';
import { User } from '../models/user';
import { UserUpdatedPublisher } from '../events/publishers/user-updated-publisher';
import { natsWrapper } from '../nats-wrapper';

const router = express.Router();

router.patch(
  '/api/users/:user_id',
  [
    body('userName')
      .optional()
      .isLength({ min: 3 })
      .withMessage('Username must be at least 3 characters'),
    body('imageUrl').optional().isURL().withMessage('Image URL must be a valid URL'),
    body('role')
      .optional()
      .isIn([UserRole.Student, UserRole.Teacher])
      .withMessage('Role must be Student or Teacher'),
    body().custom((body) => {
      if (!body.userName && !body.imageUrl && !body.role) {
        throw new Error('You must provide either userName or imageUrl or role to update');
      }
      return true;
    }),
  ],
  currentUser,
  validateRequest,
  async (req: Request, res: Response) => {
    const { user_id } = req.params;
    const { userName, imageUrl, role } = req.body;
    const currentUserId = req.currentUser!.id;

    if (currentUserId !== user_id) {
      throw new NotAuthorizedError();
    }

    const user = await User.findOne({ _id: user_id });

    if (!user) {
      throw new NotFoundError();
    }

    // Check if username is taken if user is changing it
    if (userName && userName !== user.userName) {
      const existingUsername = await User.findOne({ userName });
      if (existingUsername && existingUsername._id !== user_id) {
        throw new BadRequestError('Username is already in use');
      }
      user.userName = userName;
    }

    if (imageUrl) {
      user.imageUrl = imageUrl;
    }

    if (role) {
      user.role = role;
    }

    new UserUpdatedPublisher(natsWrapper.client).publish({
      id: user.id,
      role: user.role,
      status: user.status,
      gmail: user.email,
      userName: user.userName,
      exp: user.exp,
    });

    await user.save();

    res.status(200).send(user);
  },
);

export { router as updateProfileRouter };
