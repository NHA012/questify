import express, { Request, Response } from 'express';
import { Course } from '../../models/course';
import { Review } from '../../models/review';
import {
  NotAuthorizedError,
  requireAuth,
  NotFoundError,
  BadRequestError,
  ResourcePrefix,
} from '@datn242/questify-common';

const router = express.Router();

router.delete(
  ResourcePrefix.CourseManagement + '/:course_id/reviews/:review_id',
  requireAuth,
  async (req: Request, res: Response) => {
    const courseId = req.params.course_id;
    const reviewId = req.params.review_id;

    const course = await Course.findByPk(courseId);

    if (!course) {
      throw new NotFoundError();
    }

    const review = await Review.findByPk(reviewId);

    if (!review) {
      throw new NotFoundError();
    }

    if (review.studentId !== req.currentUser!.id) {
      throw new NotAuthorizedError();
    }

    if (review.isDeleted) {
      throw new BadRequestError('Review is already deleted');
    }

    review.set({
      isDeleted: true,
      deletedAt: new Date(),
    });

    await review.save();

    res.send(review);
  },
);

export { router as deleteReviewRouter };
