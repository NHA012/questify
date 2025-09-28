import express, { Request, Response } from 'express';
import { CodeProblem } from '../../models/code-problem';
import {
  NotAuthorizedError,
  NotFoundError,
  requireAuth,
  ResourcePrefix,
} from '@datn242/questify-common';
import { Level } from '../../models/level';
import { Testcase } from '../../models/testcase';
import { softDelete } from '../../utils/model';

const router = express.Router();

router.delete(
  ResourcePrefix.CodeProblem + '/:code_problem_id/testcases/:testcase_id',
  requireAuth,
  async (req: Request, res: Response) => {
    const { code_problem_id, testcase_id } = req.params;
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

    const testcase = await Testcase.findOne({
      where: {
        id: testcase_id,
        codeProblemId: code_problem_id,
      },
    });

    if (!testcase) {
      throw new NotFoundError();
    }

    await softDelete(Testcase, {
      id: testcase.id,
      codeProblemId: testcase.codeProblemId,
    });
    res.send({ message: 'deleted successfully' });
  },
);

export { router as deleteTestcaseRouter };
