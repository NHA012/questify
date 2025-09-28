import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { User } from '../../models/user';
import { Course } from '../../models/course';
import { Review } from '../../models/review';
import {
  validateRequest,
  requireAuth,
  ResourcePrefix,
  NotFoundError,
  BadRequestError,
} from '@datn242/questify-common';

const router = express.Router();

router.post(
  ResourcePrefix.CourseManagement + '/:course_id/reviews',
  requireAuth,
  [
    body('comment').optional().isString().withMessage('Comment must be a string'),
    body('rating')
      .notEmpty()
      .withMessage('Rating is required')
      .isFloat({ min: 1, max: 5 })
      .withMessage('Rating must be between 1 and 5'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const student = await User.findByPk(req.currentUser!.id);
    if (!student) {
      throw new BadRequestError('Student not found');
    }

    const courseId = req.params.course_id;

    const course = await Course.findByPk(courseId);

    if (!course) {
      throw new NotFoundError();
    }

    const { comment, rating } = req.body;

    checkRating(rating);

    const review = await Review.create({
      studentId: student.id,
      courseId: course.id,
      comment,
      rating,
      isDeleted: false,
    });

    res.status(201).send(review);
  },
);

const checkRating = (rating: string) => {
  const ratingNumber = Number(rating);
  const decimalPart = ratingNumber % 1;
  if (decimalPart !== 0 && decimalPart !== 0.5) {
    throw new BadRequestError('Rating must be in increments of 0.5 (e.g., 1, 1.5, 2, 2.5, etc.)');
  }
};

export { router as createReviewRouter };
