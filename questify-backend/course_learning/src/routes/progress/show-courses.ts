import express, { Request, Response } from 'express';
import { BadRequestError, ResourcePrefix, validateRequest } from '@datn242/questify-common';
import { User } from '../../models/user';
import { query } from 'express-validator';
import { getUserCourseProgress } from '../../services/get-course-progress';

const router = express.Router();

router.get(
  ResourcePrefix.CourseLearning + '/progress/courses',
  [
    query('page')
      .optional()
      .isInt({ min: 1 })
      .withMessage('page must be a positive integer')
      .toInt(),
    query('page-size')
      .optional()
      .isInt({ min: 1, max: 100 })
      .withMessage('page-size must be between 1 and 100')
      .toInt(),
    query('userId').optional().isUUID().withMessage('user-id must be a valid UUID'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    try {
      const page = parseInt((req.query['page'] as string) || '1');
      const pageSize = parseInt((req.query['page-size'] as string) || '10');
      let userId = req.query['userId'] as string;
      if (!userId) {
        userId = req.currentUser!.id;
      }

      const student = await User.findByPk(userId);
      if (!student) {
        throw new BadRequestError('Student not found');
      }

      const progressResponse = await getUserCourseProgress(userId, page, pageSize);

      res.status(200).send(progressResponse);
    } catch (error) {
      if (error instanceof BadRequestError) {
        throw error;
      }
      console.error('Error fetching course progress:', error);
      throw new Error('Failed to fetch course progress');
    }
  },
);

export { router as showCourseProgressRouter };
