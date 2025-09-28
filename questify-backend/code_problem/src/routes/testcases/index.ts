import express, { Request, Response } from 'express';
import { NotFoundError, ResourcePrefix } from '@datn242/questify-common';
import { Testcase } from '../../models/testcase';

const router = express.Router();

router.get(
  ResourcePrefix.CodeProblem + '/:code_problem_id/testcases',
  async (req: Request, res: Response) => {
    const { code_problem_id } = req.params;
    const testcases = await Testcase.findAll({
      where: {
        codeProblemId: code_problem_id,
      },
    });

    if (!testcases) {
      throw new NotFoundError();
    }

    res.send(testcases);
  },
);

export { router as indexTestcaseRouter };
