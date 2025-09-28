import express, { Request, Response } from 'express';
import {
  NotAuthorizedError,
  requireAuth,
  UserRole,
  validateRequest,
  ResourcePrefix,
  BadRequestError,
} from '@datn242/questify-common';
import { body } from 'express-validator';
import { Feedback } from '../../models/feedback';
import { Attempt } from '../../models/attempt';

const router = express.Router();

router.post(
  ResourcePrefix.CourseLearning + '/feedback',
  requireAuth,
  [
    body('attempt_id')
      .exists()
      .withMessage('attemp_id is required')
      .isUUID()
      .withMessage('attempt_id must be a valid UUID'),
    body('message')
      .exists()
      .withMessage('message is required')
      .isString()
      .withMessage('message must be a string'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { attempt_id, message } = req.body;

    if (req.currentUser!.role !== UserRole.Teacher) {
      throw new NotAuthorizedError();
    }

    const attempt = await Attempt.findByPk(attempt_id);
    if (!attempt) {
      throw new BadRequestError('Attempt not found');
    }

    const feedback = await Feedback.create({
      message,
      teacherId: req.currentUser!.id,
      attemptId: attempt.id,
    });

    res.status(201).send(feedback);
  },
);

export { router as createFeedbackRouter };
