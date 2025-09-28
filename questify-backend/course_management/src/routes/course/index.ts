import express, { Request, Response } from 'express';
import { Course } from '../../models/course';
import { CourseStatus, ResourcePrefix } from '@datn242/questify-common';

const router = express.Router();

router.get(ResourcePrefix.CourseManagement, async (req: Request, res: Response) => {
  const courses = await Course.findAll({ where: { status: CourseStatus.Approved } });

  res.send(courses);
});

export { router as indexCourseRouter };
