import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import jwt from 'jsonwebtoken';
import { UserRole } from '@datn242/questify-common';
import { validateRequest, BadRequestError, NotFoundError } from '@datn242/questify-common';
import { User } from '../models/user';
import { UserCreatedPublisher } from '../events/publishers/user-created-publisher';
import { natsWrapper } from '../nats-wrapper';

const router = express.Router();

router.post(
  '/api/users/validate-credentials',
  [
    body('email').isEmail().withMessage('Email must be valid'),
    body('userName')
      .trim()
      .notEmpty()
      .withMessage('Username is required')
      .isLength({ min: 3 })
      .withMessage('Username must be at least 3 characters'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { userName, email } = req.body;

    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      throw new BadRequestError('Email is already in use');
    }

    const existingUsername = await User.findOne({ userName });
    if (existingUsername) {
      throw new BadRequestError('Username is already in use');
    }

    req.session = {
      ...req.session,
      pendingSignup: {
        userName,
        email,
      },
    };

    res.status(200).send({ valid: true });
  },
);

router.post(
  '/api/users/complete-signup',
  [
    body('password')
      .trim()
      .isLength({ min: 8, max: 20 })
      .withMessage('Password must be between 8 and 20 characters'),
    body('confirmedPassword')
      .trim()
      .isLength({ min: 8, max: 20 })
      .withMessage('Password must be between 8 and 20 characters'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { password, confirmedPassword } = req.body;

    if (!req.session?.pendingSignup) {
      throw new NotFoundError();
    }

    const { userName, email } = req.session.pendingSignup;

    const existingUser = await User.findOne({
      $or: [{ email }, { userName }],
    });
    if (existingUser) {
      throw new BadRequestError('Email or username is no longer available');
    }

    if (password !== confirmedPassword) {
      throw new BadRequestError('Passwords do not match');
    }

    const user = User.build({
      userName,
      email,
      password,
      role: UserRole.Student,
      exp: 0,
    });

    await user.save();
    new UserCreatedPublisher(natsWrapper.client).publish({
      id: user.id,
      role: user.role,
      status: user.status,
      gmail: user.email,
      userName: user.userName,
      exp: user.exp,
    });

    const userJwt = jwt.sign(
      {
        id: user.id,
        email: user.email,
        userName: user.userName,
        role: user.role,
        userExp: user.exp,
      },
      process.env.JWT_KEY!,
    );

    req.session = {
      jwt: userJwt,
    };

    res.status(201).send(user);
  },
);

export { router as signupRouter };
