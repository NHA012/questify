import express, { Request, Response } from 'express';
import { NotFoundError, ResourcePrefix } from '@datn242/questify-common';
import { Course } from '../../models/course';
import { Review } from '../../models/review';

const router = express.Router();

router.get(
  ResourcePrefix.CourseManagement + '/:course_id/reviews',
  async (req: Request, res: Response) => {
    const course = await Course.findByPk(req.params.course_id);

    if (!course) {
      throw new NotFoundError();
    }

    const reviews = await Review.findAll({
      where: {
        courseId: course.id,
      },
    });

    res.send(reviews);
  },
);

export { router as showReviewRouter };
