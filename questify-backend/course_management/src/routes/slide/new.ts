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
  SlideType,
} from '@datn242/questify-common';
import { Course } from '../../models/course';
import { Challenge } from '../../models/challenge';
import { Slide } from '../../models/slide';
import { SlideCreatedPublisher } from '../../events/publishers/slide-created-publisher';
import { natsWrapper } from '../../nats-wrapper';

const router = express.Router();

router.post(
  ResourcePrefix.CourseManagement + '/challenge/:challenge_id/slide',
  requireAuth,
  [
    body('title').optional({ nullable: true }).isString().withMessage('Title must be a string'),
    body('description')
      .optional({ nullable: true })
      .isString()
      .withMessage('Description must be a string'),
    body('slideNumber')
      .notEmpty()
      .withMessage('slide Number is required')
      .isInt()
      .withMessage('slide Number must be an integer'),
    body('type')
      .notEmpty()
      .withMessage('Slide type is required')
      .isIn(Object.values(SlideType))
      .withMessage('Invalid slide type'),
    body('videoUrl')
      .optional({ nullable: true })
      .isString()
      .withMessage('Video URL must be a string'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { challenge_id } = req.params;
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

    const slide = Slide.build({
      challengeId: challenge.id.toString(),
      title,
      description,
      slideNumber,
      type,
      answers,
      videoUrl,
    });

    await slide.save();

    new SlideCreatedPublisher(natsWrapper.client).publish({
      id: slide.id,
      title: slide.title,
      description: slide.description,
      slideNumber: slide.slideNumber,
      type: slide.type,
      imageUrl: slide.imageUrl,
      videoUrl: slide.videoUrl,
      answers: slide.answers,
      challengeId: slide.challengeId,
    });
    res.status(201).send(slide);
  },
);

export { router as createSlideRouter };
