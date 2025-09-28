import express, { Request, Response } from 'express';
import { requireAuth, ResourcePrefix, BadRequestError } from '@datn242/questify-common';
import { Challenge } from '../../models/challenge';
import { Level } from '../../models/level';
import { submitLevel } from '../../services/submit-challenge';

const router = express.Router();

router.post(
  ResourcePrefix.CourseLearning + '/challenge/:challenge_id/submission',
  requireAuth,
  async (req: Request, res: Response) => {
    const { challenge_id } = req.params;
    const challenge = await Challenge.findOne({
      where: { id: challenge_id },
    });
    if (!challenge) {
      throw new BadRequestError('Challenge not found');
    }

    const level = await Level.findOne({
      where: {
        id: challenge.levelId,
      },
    });

    if (!level) {
      throw new BadRequestError('Level not found');
    }

    const submitResponse = await submitLevel(req.currentUser!.id, level.id);

    res.status(200).send(submitResponse);
  },
);

export { router as submitChallengeRouter };
