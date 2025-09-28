import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { Attempt } from '../../models/attempt';
import { Level } from '../../models/level';
import {
  validateRequest,
  requireAuth,
  NotAuthorizedError,
  BadRequestError,
  ResourcePrefix,
} from '@datn242/questify-common';

const router = express.Router();

router.post(
  ResourcePrefix.CodeProblem + '/attempts',
  requireAuth,
  [
    body('student_id')
      .exists()
      .withMessage('student_id is required')
      .isUUID()
      .withMessage('student_id must be a valid UUID'),
    body('level_id')
      .exists()
      .withMessage('level_id is required')
      .isUUID()
      .withMessage('level_id must be a valid UUID'),
    body('answer').notEmpty().withMessage('answer is required'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { student_id, level_id, answer } = req.body;

    if (req.currentUser!.id !== student_id) {
      throw new NotAuthorizedError();
    }

    const level = await Level.findByPk(level_id);
    if (!level) {
      throw new BadRequestError('Level not found');
    }

    const attempt = await Attempt.create({
      userId: student_id,
      levelId: level_id,
      answer: answer,
    });

    res.status(201).send(attempt);
  },
);

export { router as createAttemptRouter };
