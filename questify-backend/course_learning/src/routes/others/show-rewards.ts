import express, { Request, Response } from 'express';
import {
  requireAuth,
  validateRequest,
  ResourcePrefix,
  NotFoundError,
} from '@datn242/questify-common';
import { param } from 'express-validator';
import { User } from '../../models/user';
import { Reward } from '../../models/reward';

const router = express.Router();

router.get(
  ResourcePrefix.CourseLearning + '/students/:student_id/rewards',
  requireAuth,
  [param('student_id').isUUID().withMessage('student_id must be a valid UUID')],
  validateRequest,
  async (req: Request, res: Response) => {
    const { student_id } = req.params;

    const student = await User.findByPk(student_id, {
      include: [
        {
          model: Reward,
          as: 'rewards',
        },
      ],
    });
    if (!student) {
      throw new NotFoundError();
    }

    const rewards = student.rewards || [];
    res.status(200).send(rewards);
  },
);

export { router as showRewardsRouter };
