import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { CodeProblem } from '../../models/code-problem';
import {
  NotAuthorizedError,
  NotFoundError,
  requireAuth,
  ResourcePrefix,
  validateRequest,
} from '@datn242/questify-common';
import { Level } from '../../models/level';

const router = express.Router();

router.patch(
  ResourcePrefix.CodeProblem + '/:code_problem_id',
  requireAuth,
  [body('description').isString().withMessage('description must be a string')],
  validateRequest,
  async (req: Request, res: Response) => {
    const { code_problem_id } = req.params;
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
      throw new NotFoundError();
    }

    const level = code_problem.get('Level') as Level;

    if (!level) {
      throw new NotFoundError();
    }

    if (level.teacherId !== req.currentUser!.id) {
      throw new NotAuthorizedError();
    }

    const updateFields: Partial<CodeProblem> = {};
    const { description } = req.body;

    if (description !== undefined) updateFields['description'] = description;
    code_problem.set(updateFields);

    await code_problem.save();
    res.status(201).send(code_problem);
  },
);

export { router as updateCodeProblemRouter };
