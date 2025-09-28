import express, { Request, Response } from 'express';
import { Attempt } from '../../models/attempt';
import { requireAuth, ResourcePrefix, NotFoundError } from '@datn242/questify-common';
import { Level } from '../../models/level';
import { User } from '../../models/user';

const router = express.Router();

router.get(
  `${ResourcePrefix.CodeProblem}/attempts/:student_id/:level_id`,
  requireAuth,
  async (req: Request, res: Response) => {
    const { student_id, level_id } = req.params;

    const student = await User.findByPk(student_id);
    if (!student) {
      throw new NotFoundError();
    }

    const level = await Level.findByPk(level_id);
    if (!level) {
      throw new NotFoundError();
    }

    const attempts = await Attempt.findAll({
      where: {
        levelId: level_id,
        userId: student_id,
      },
    });

    res.status(200).send(attempts);
  },
);

export { router as indexAttemptRouter };
