import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { Island } from '../../models/island';
import { Level } from '../../models/level';
import {
  validateRequest,
  requireAuth,
  BadRequestError,
  NotAuthorizedError,
  ResourcePrefix,
  NotFoundError,
  SlideType,
} from '@datn242/questify-common';
import { Course } from '../../models/course';
import { Challenge } from '../../models/challenge';
import { Slide } from '../../models/slide';
import { SlideUpdatedPublisher } from '../../events/publishers/slide-updated-publisher';
import { natsWrapper } from '../../nats-wrapper';

const router = express.Router();

router.patch(
  ResourcePrefix.CourseManagement + '/challenge/:challenge_id/slide/:slide_id',
  requireAuth,
  [
    body('title').optional().isString().withMessage('Title must be a string'),
    body('description')
      .optional({ nullable: true })
      .isString()
      .withMessage('Description must be a string'),
    body('slideNumber')
      .optional({ nullable: true })
      .isInt()
      .withMessage('slide Number must be an integer'),
    body('type')
      .optional({ nullable: true })
      .isIn(Object.values(SlideType))
      .withMessage('Invalid slide type'),
    body('videoUrl')
      .optional({ nullable: true })
      .isString()
      .withMessage('Video URL must be a string'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { challenge_id, slide_id } = req.params;
    const { title, description, slideNumber, type, videoUrl, answers } = req.body;
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

    const updateFields: Partial<typeof slide> = {};

    if (title !== undefined) updateFields.title = title;
    if (description !== undefined) updateFields.description = description;
    if (slideNumber !== undefined) updateFields.slideNumber = slideNumber;
    if (type !== undefined) updateFields.type = type;
    if (videoUrl !== undefined) updateFields.videoUrl = videoUrl;
    if (answers !== undefined) updateFields.answers = answers;

    slide.set(updateFields);

    await slide.save();
    new SlideUpdatedPublisher(natsWrapper.client).publish(slide);

    res.status(201).send(slide);
  },
);

export { router as updateSlideRouter };
