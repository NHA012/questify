import express, { Request, Response } from 'express';
import {
  BadRequestError,
  requireAuth,
  validateRequest,
  ResourcePrefix,
} from '@datn242/questify-common';
import { query } from 'express-validator';
import { User } from '../../models/user';
import { Feedback } from '../../models/feedback';
import { Level } from '../../models/level';
import { Attempt } from '../../models/attempt';
import { Op } from 'sequelize';

const router = express.Router();

router.get(
  ResourcePrefix.CourseLearning + '/feedback',
  requireAuth,
  [
    query('student-id')
      .exists()
      .withMessage('student-id is required')
      .isUUID()
      .withMessage('student-id must be a valid UUID'),
    query('level-id')
      .exists()
      .withMessage('level-id is required')
      .isUUID()
      .withMessage('level-id must be a valid UUID'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const student_id = req.query['student-id'] as string;
    const level_id = req.query['level-id'] as string;
    const student = await User.findByPk(student_id);
    if (!student) {
      throw new BadRequestError('Student not found');
    }

    const level = await Level.findByPk(level_id);
    if (!level) {
      throw new BadRequestError('Level not found');
    }

    const attempts = await Attempt.findAll({
      where: {
        userId: student.id,
        levelId: level.id,
      },
    });
    const attemptIds = attempts.map((attempt) => attempt.id);

    const feedbacks = await Feedback.findAll({
      where: {
        attemptId: {
          [Op.in]: attemptIds,
        },
      },
    });

    res.send({ feedbacks });
  },
);

export { router as showFeedbackRouter };
