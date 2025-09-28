import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { CodeProblem } from '../../models/code-problem';
import {
  validateRequest,
  requireAuth,
  UserRole,
  NotAuthorizedError,
  BadRequestError,
  ResourcePrefix,
} from '@datn242/questify-common';
import { Level } from '../../models/level';
import { Testcase } from '../../models/testcase';

interface TestcaseInput {
  input: string[];
  output: string[];
  hidden: boolean;
}

const router = express.Router();

router.post(
  ResourcePrefix.CodeProblem,
  requireAuth,
  [
    body('level_id')
      .exists()
      .withMessage('level_id is required')
      .isUUID()
      .withMessage('level_id must be a valid UUID'),
    body('id').optional().isUUID().withMessage('id must be a valid UUID'),
    body('title').isString().withMessage('title must be a string'),
    body('description').isString().withMessage('description must be a string'),
    body('parameters').optional().isArray().withMessage('parameters must be an array'),
    body('returnType').optional().isObject().withMessage('returnType must be an object'),
    body('starterCode').isString().withMessage('starterCode must be a string'),
    body('testcases').optional().isArray().withMessage('testcases must be an array'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const {
      level_id,
      id,
      title,
      description,
      parameters = [],
      returnType = {},
      starterCode,
      testcases,
    } = req.body;

    if (req.currentUser!.role !== UserRole.Teacher) {
      throw new NotAuthorizedError();
    }

    const level = await Level.findByPk(level_id);
    if (!level) {
      throw new BadRequestError('Level not found');
    }

    if (level.teacherId !== req.currentUser!.id) {
      throw new NotAuthorizedError();
    }

    if (id) {
      const existingCodeProblem = await CodeProblem.findByPk(id);
      if (existingCodeProblem) {
        throw new BadRequestError('Code problem with this ID already exists');
      }
    }
    const code_problem = await CodeProblem.create({
      ...(id ? { id } : {}), // Only include id if it exists in the request body
      levelId: level.id,
      title,
      description,
      parameters: parameters,
      returnType: returnType,
      starterCode: starterCode,
    });

    if (testcases && testcases.length > 0) {
      const formattedTestcases = testcases.map((testcase: TestcaseInput) => ({
        codeProblemId: code_problem.id,
        input: testcase.input,
        output: testcase.output,
        hidden: !testcase.hidden,
      }));

      await Testcase.bulkCreate(formattedTestcases);
    }

    const completeCodeProblem = await CodeProblem.findOne({
      where: {
        id: code_problem.id,
      },
      include: [
        {
          model: Testcase,
          as: 'Testcases',
          required: false,
        },
      ],
    });

    res.status(201).send(completeCodeProblem);
  },
);

export { router as createCodeProblemRouter };
