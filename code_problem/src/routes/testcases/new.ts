import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { CodeProblem } from '../../models/code-problem';
import { Testcase } from '../../models/testcase';
import {
  validateRequest,
  requireAuth,
  UserRole,
  NotAuthorizedError,
  BadRequestError,
  ResourcePrefix,
} from '@datn242/questify-common';
import { Level } from '../../models/level';

interface TestcaseInput {
  input: string;
  output: string;
  hidden: boolean;
}

const router = express.Router();

router.post(
  ResourcePrefix.CodeProblem + '/:code_problem_id/testcases',
  requireAuth,
  [
    body('testcases')
      .isArray({ min: 1 })
      .withMessage('testcases must be a non-empty array')
      .custom((arr: TestcaseInput[]) =>
        arr.every(
          (item) =>
            item.input !== undefined &&
            item.output !== undefined &&
            typeof item.hidden === 'boolean',
        ),
      )
      .withMessage('Each testcase must have input, output, and hidden (boolean)'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { code_problem_id } = req.params;
    const { testcases } = req.body;

    if (req.currentUser!.role !== UserRole.Teacher) {
      throw new NotAuthorizedError();
    }

    const code_problem = await CodeProblem.findOne({
      where: {
        id: code_problem_id,
      },
      include: [
        {
          model: Level,
          as: 'Level',
          required: false,
        },
      ],
    });
    if (!code_problem) {
      throw new BadRequestError('Code Problem not found');
    }

    const level = code_problem.get('Level') as Level;

    if (level.teacherId !== req.currentUser!.id) {
      throw new NotAuthorizedError();
    }

    const formattedTestcases = testcases.map((testcase: TestcaseInput) => ({
      codeProblemId: code_problem.id,
      input: testcase.input,
      output: testcase.output,
      hidden: testcase.hidden,
    }));

    const createdTestcases = await Testcase.bulkCreate(formattedTestcases);

    res.status(201).send(createdTestcases);
  },
);

export { router as createTestcaseRouter };
