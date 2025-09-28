import express, { Request, Response } from 'express';
import { Course } from '../../models/course';
import {
  NotAuthorizedError,
  requireAuth,
  NotFoundError,
  BadRequestError,
  ResourcePrefix,
} from '@datn242/questify-common';
import { Slide } from '../../models/slide';
import { Challenge } from '../../models/challenge';
import { Level } from '../../models/level';
import { Island } from '../../models/island';

const router = express.Router();

router.delete(
  ResourcePrefix.CourseManagement + '/challenge/:challenge_id/slide/:slide_id',
  requireAuth,
  async (req: Request, res: Response) => {
    const { challenge_id, slide_id } = req.params;
    const challenge = await Challenge.findByPk(challenge_id);

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

    const slide = await Slide.findByPk(slide_id);

    if (!slide) {
      throw new NotFoundError();
    }

    if (slide.isDeleted) {
      throw new BadRequestError('Course is already deleted');
    }

    slide.set({
      isDeleted: true,
    });

    await slide.save();

    res.send(slide);
  },
);

export { router as deleteSlideRouter };
