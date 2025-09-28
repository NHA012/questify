import express, { Request, Response } from 'express';
import { NotFoundError, ResourcePrefix } from '@datn242/questify-common';
import { Course } from '../../models/course';
import { Island } from '../../models/island';

const router = express.Router();

router.get(
  ResourcePrefix.CourseManagement + '/course/:course_id',
  async (req: Request, res: Response) => {
    const course = await Course.findByPk(req.params.course_id);

    if (!course) {
      throw new NotFoundError();
    }

    const islandCount = await Island.count({ where: { courseId: course.id } });

    const courseData = course.toJSON();

    res.send({
      ...courseData,
      islandCount,
    });
  },
);

export { router as showCourseRouter };
