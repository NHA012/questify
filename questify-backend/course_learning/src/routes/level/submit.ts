import express, { Request, Response } from 'express';
import { requireAuth, ResourcePrefix, BadRequestError } from '@datn242/questify-common';
import { Level } from '../../models/level';
import { submitLevel } from '../../services/submit-challenge';

const router = express.Router();

router.post(
  ResourcePrefix.CourseLearning + '/level/:level_id/submission',
  requireAuth,
  async (req: Request, res: Response) => {
    const { level_id } = req.params;

    const level = await Level.findOne({
      where: {
        id: level_id,
      },
    });

    if (!level) {
      throw new BadRequestError('Level not found');
    }

    const submitResponse = await submitLevel(req.currentUser!.id, level.id);

    res.status(200).send(submitResponse);
  },
);

export { router as submitLevelRouter };
