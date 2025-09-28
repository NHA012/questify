import express, { Request, Response } from 'express';
import { requireAuth, ResourcePrefix, requireAdmin } from '@datn242/questify-common';
import { AdminCourse } from '../../models/admin-course';
import { User } from '../../models/user';
import { Course } from '../../models/course';

const router = express.Router();

router.get(
  `${ResourcePrefix.Admin}/actions/courses`,
  requireAuth,
  requireAdmin,
  async (req: Request, res: Response) => {
    const adminActions = await AdminCourse.findAll({
      order: [['createdAt', 'DESC']],
    });

    const actionsWithRelations = await Promise.all(
      adminActions.map(async (action) => {
        const admin = await User.findByPk(action.adminId, {
          attributes: ['id', 'userName', 'gmail'],
        });

        const course = await Course.findByPk(action.courseId, {
          attributes: ['id', 'name', 'description', 'status', 'teacherId'],
        });

        const teacher = course
          ? await User.findByPk(course.teacherId, {
              attributes: ['id', 'userName', 'gmail'],
            })
          : null;

        return {
          ...action.toJSON(),
          admin: admin ? admin.toJSON() : null,
          course: course
            ? {
                ...course.toJSON(),
                teacher: teacher ? teacher.toJSON() : null,
              }
            : null,
        };
      }),
    );

    res.status(200).send(actionsWithRelations);
  },
);

export { router as courseActionsRouter };
