import express, { Request, Response } from 'express';
import {
  BadRequestError,
  NotFoundError,
  ResourcePrefix,
  validateRequest,
} from '@datn242/questify-common';
import { Level } from '../../models/level';
import { param } from 'express-validator';
import { UserLevel } from '../../models/user-level';
import { Attempt } from '../../models/attempt';

const router = express.Router();

router.get(
  ResourcePrefix.CourseLearning + '/levels/:level_id/attempt',
  [param('level_id').isUUID().withMessage('level_id must be a valid UUID')],
  validateRequest,
  async (req: Request, res: Response) => {
    const { level_id } = req.params;

    const level = await Level.findByPk(level_id);

    if (!level) {
      throw new NotFoundError();
    }

    const userLevel = await UserLevel.findOne({
      where: {
        userId: req.currentUser!.id,
        levelId: level_id,
      },
    });

    if (!userLevel) {
      throw new BadRequestError('Student have not enrolled this course');
    }

    const attempts = await Attempt.findAll({
      where: {
        userId: req.currentUser!.id,
        levelId: level_id,
      },
      order: [['createdAt', 'DESC']],
    });

    res.send(attempts);
  },
);

export { router as indexAttemptRouter };
