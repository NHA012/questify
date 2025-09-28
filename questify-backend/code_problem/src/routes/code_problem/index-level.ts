import express, { Request, Response } from 'express';
import { ResourcePrefix } from '@datn242/questify-common';
import { CodeProblem } from '../../models/code-problem';
import { Testcase } from '../../models/testcase';

const router = express.Router();

router.get(ResourcePrefix.CodeProblem + '/level/:level_id', async (req: Request, res: Response) => {
  const { level_id } = req.params;
  const code_problem = await CodeProblem.findOne({
    where: {
      levelId: level_id,
    },
    include: [
      {
        model: Testcase,
        as: 'Testcases',
        required: false,
      },
    ],
  });

  res.send(code_problem);
});

export { router as showCodeProblemByLevelRouter };
