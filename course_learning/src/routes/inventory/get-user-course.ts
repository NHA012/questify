import express, { Request, Response } from 'express';
import { UserCourse } from '../../models/user-course';
import { ResourcePrefix, requireAuth, NotFoundError } from '@datn242/questify-common';

const router = express.Router();

router.get(
  ResourcePrefix.CourseLearning + '/:course_id/user-course',
  requireAuth,
  async (req: Request, res: Response) => {
    const courseId = req.params.course_id;
    const userId = req.currentUser!.id;

    const userCourse = await UserCourse.findOne({
      where: {
        userId: userId,
        courseId: courseId,
      },
    });

    if (!userCourse) {
      throw new NotFoundError();
    }

    res.status(200).send(userCourse);
  },
);

export { router as getUserCourseRouter };
