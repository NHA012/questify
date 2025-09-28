import express, { Request, Response } from 'express';
import { CodeProblem } from '../../models/code-problem';
import {
  NotAuthorizedError,
  NotFoundError,
  requireAuth,
  ResourcePrefix,
} from '@datn242/questify-common';
import { Level } from '../../models/level';
import { softDelete } from '../../utils/model';

const router = express.Router();

router.delete(
  ResourcePrefix.CodeProblem + '/:code_problem_id',
  requireAuth,
  async (req: Request, res: Response) => {
    const { code_problem_id } = req.params;
    const code_problem = await CodeProblem.findByPk(code_problem_id);

    if (!code_problem) {
      throw new NotFoundError();
    }

    const level = await Level.findByPk(code_problem.levelId);

    if (!level) {
      throw new NotFoundError();
    }

    if (level.teacherId !== req.currentUser!.id) {
      throw new NotAuthorizedError();
    }

    await softDelete(CodeProblem, { id: code_problem.id });
    res.send({ message: 'deleted successfully' });
  },
);

export { router as deleteCodeProblemRouter };
