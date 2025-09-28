import express, { Request, Response } from 'express';
import { Course } from '../../models/course';
import { requireAuth, ResourcePrefix } from '@datn242/questify-common';

const router = express.Router();

router.get(
  ResourcePrefix.CourseManagement + '/instructor',
  requireAuth,
  async (req: Request, res: Response) => {
    const courses = await Course.findAll({ where: { teacherId: req.currentUser!.id } });

    res.send(courses);
  },
);

export { router as indexCourseIntructorRouter };
