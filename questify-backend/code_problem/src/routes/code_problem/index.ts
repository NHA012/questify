import express, { Request, Response } from 'express';
import { NotFoundError, ResourcePrefix } from '@datn242/questify-common';
import { CodeProblem } from '../../models/code-problem';

const router = express.Router();

router.get(ResourcePrefix.CodeProblem, async (req: Request, res: Response) => {
  const code_problems = await CodeProblem.findAll();

  if (!code_problems) {
    throw new NotFoundError();
  }

  res.send(code_problems);
});

export { router as indexCodeProblemRouter };
