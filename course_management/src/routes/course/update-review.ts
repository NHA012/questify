import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { Course } from '../../models/course';
import { Review } from '../../models/review';
import {
  NotAuthorizedError,
  NotFoundError,
  validateRequest,
  requireAuth,
  ResourcePrefix,
  BadRequestError,
} from '@datn242/questify-common';

const router = express.Router();

router.patch(
  ResourcePrefix.CourseManagement + '/:course_id/reviews/:review_id',
  requireAuth,
  [
    body('comment').optional().isString().withMessage('Comment must be a string'),
    body('rating')
      .optional()
      .isFloat({ min: 1, max: 5 })
      .withMessage('Rating must be between 1 and 5'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const course = await Course.findByPk(req.params.course_id);

    if (!course) {
      throw new NotFoundError();
    }

    const review = await Review.findByPk(req.params.review_id);

    if (!review) {
      throw new NotFoundError();
    }
    if (review.studentId !== req.currentUser!.id) {
      throw new NotAuthorizedError();
    }

    const updateFields: Partial<Review> = {};
    const { comment, rating } = req.body;
    checkRating(rating);

    if (comment !== undefined) updateFields['comment'] = comment;
    if (rating !== undefined) updateFields['rating'] = rating;
    review.set(updateFields);

    await review.save();
    res.send(review);
  },
);

const checkRating = (rating: string) => {
  const ratingNumber = Number(rating);
  const decimalPart = ratingNumber % 1;
  if (decimalPart !== 0 && decimalPart !== 0.5) {
    throw new BadRequestError('Rating must be in increments of 0.5 (e.g., 1, 1.5, 2, 2.5, etc.)');
  }
};

export { router as updateReviewRouter };
