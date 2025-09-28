import express, { Request, Response } from 'express';
import { BadRequestError, NotAuthorizedError, ResourcePrefix } from '@datn242/questify-common';
import { Challenge } from '../../models/challenge';
import { Slide } from '../../models/slide';
import { Level } from '../../models/level';
import { Island } from '../../models/island';
import { Course } from '../../models/course';

const router = express.Router();

router.get(
  ResourcePrefix.CourseManagement + '/challenge/:challenge_id',
  async (req: Request, res: Response) => {
    const challenge = await Challenge.findByPk(req.params.challenge_id, {
      include: [
        {
          model: Slide,
          as: 'Slides',
          required: false,
          order: [['slideNumber', 'ASC']],
        },
      ],
    });

    if (!challenge) {
      throw new BadRequestError('Challenge not found');
    }

    const level = await Level.findByPk(challenge.levelId);
    if (!level) {
      throw new BadRequestError('Level not found');
    }
    const island = await Island.findByPk(level.islandId, {
      include: [
        {
          model: Course,
          as: 'Course',
          required: false,
        },
      ],
    });
    if (!island) {
      throw new BadRequestError('Island not found');
    }

    const course = island.get('Course') as Course;

    if (course.teacherId !== req.currentUser!.id) {
      throw new NotAuthorizedError();
    }

    const challengeData = challenge.toJSON();
    const responseData = {
      ...challengeData,
      courseId: course.id,
    };

    res.send(responseData);
  },
);

export { router as showChallengeRouter };
