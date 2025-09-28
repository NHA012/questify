import express, { Request, Response } from 'express';
import {
  currentUser,
  NotAuthorizedError,
  NotFoundError,
  ResourcePrefix,
} from '@datn242/questify-common';
import { Attempt } from '../../models/attempt';
import { Level } from '../../models/level';

const router = express.Router();

router.get(
  ResourcePrefix.CodeProblem + '/attempts/:attempt_id',
  currentUser,
  async (req: Request, res: Response) => {
    const { attempt_id } = req.params;
    const attempt = await Attempt.findByPk(attempt_id, {
      include: [
        {
          model: Level,
          as: 'Level',
          required: false,
        },
      ],
    });

    if (!attempt) {
      throw new NotFoundError();
    }

    const level = attempt.get('Level') as Level;

    if (attempt.userId !== req.currentUser!.id || level.teacherId !== req.currentUser!.id) {
      throw new NotAuthorizedError();
    }

    res.send(attempt);
  },
);

export { router as showAttemptRouter };
