import express, { Request, Response } from 'express';
import { NotFoundError, ResourcePrefix } from '@datn242/questify-common';
import { CodeProblem } from '../../models/code-problem';

const router = express.Router();

router.get(
  ResourcePrefix.CodeProblem + '/:code_problem_id',
  async (req: Request, res: Response) => {
    const { code_problem_id } = req.params;
    const code_problem = await CodeProblem.findByPk(code_problem_id);

    if (!code_problem) {
      throw new NotFoundError();
    }

    res.send(code_problem);
  },
);

export { router as showCodeProblemRouter };
