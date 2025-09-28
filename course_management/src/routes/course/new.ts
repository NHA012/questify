import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { Course } from '../../models/course';
import {
  validateRequest,
  requireAuth,
  ResourcePrefix,
  CourseCategory,
  CourseStatus,
} from '@datn242/questify-common';
import { CourseCreatedPublisher } from '../../events/publishers/course-created-publisher';
import { natsWrapper } from '../../nats-wrapper';

const router = express.Router();

router.post(
  ResourcePrefix.CourseManagement,
  requireAuth,
  [
    body('name').notEmpty().withMessage('Course name is required').trim(),
    body('category')
      .optional()
      .isIn(Object.values(CourseCategory))
      .withMessage('Invalid course category'),
    body('price').optional().isFloat({ min: 0 }).withMessage('Price must be a positive number'),
    body('learningObjectives')
      .optional()
      .isArray()
      .withMessage('Learning objectives must be an array of strings')
      .custom((arr: unknown[]) => arr.every((item): item is string => typeof item === 'string'))
      .withMessage('All learning objectives must be strings'),
    body('requirements')
      .optional()
      .isArray()
      .withMessage('Requirements must be an array of strings')
      .custom((arr: unknown[]) => arr.every((item): item is string => typeof item === 'string'))
      .withMessage('All requirements must be strings'),
    body('targetAudience')
      .optional()
      .isArray()
      .withMessage('Target audience must be an array of strings')
      .custom((arr: unknown[]) => arr.every((item): item is string => typeof item === 'string'))
      .withMessage('All target audience values must be strings'),
    body('status')
      .optional()
      .isIn(Object.values(CourseStatus))
      .withMessage('Invalid course status'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const {
      name,
      shortDescription,
      description,
      backgroundImage,
      thumbnail,
      category,
      price,
      learningObjectives,
      requirements,
      targetAudience,
      status,
    } = req.body;

    const course = Course.build({
      name,
      shortDescription,
      description,
      backgroundImage,
      thumbnail,
      category,
      price,
      learningObjectives,
      requirements,
      targetAudience,
      status: status || CourseStatus.Pending,
      teacherId: req.currentUser!.id,
    });

    await course.save();

    new CourseCreatedPublisher(natsWrapper.client).publish({
      id: course.id,
      name: course.name,
      description: course.description,
      category: course.category,
      price: course.price,
      thumbnail: course.thumbnail,
      status: course.status || CourseStatus.Pending,
      teacherId: course.teacherId,
      backgroundImage: course.backgroundImage,
    });

    res.status(201).send(course);
  },
);

export { router as createCourseRouter };
