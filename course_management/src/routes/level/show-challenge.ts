import express, { Request, Response } from 'express';
import { BadRequestError, ResourcePrefix } from '@datn242/questify-common';
import { Level } from '../../models/level';
import { Challenge } from '../../models/challenge';

const router = express.Router();

router.get(
  ResourcePrefix.CourseManagement + '/level/:level_id/challenge',
  async (req: Request, res: Response) => {
    const level = await Level.findByPk(req.params.level_id, {
      include: [
        {
          model: Challenge,
          as: 'Challenge',
          required: false,
        },
      ],
    });

    if (!level) {
      throw new BadRequestError('Level not found');
    }

    const levelData = level.toJSON();

    res.send(levelData);
  },
);

export { router as showLevelChallengeRouter };
