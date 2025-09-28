import express, { Request, Response } from 'express';
import { Course } from '../../models/course';
import { NotAuthorizedError, NotFoundError } from '@datn242/questify-common';
import { Island } from '../../models/island';
import { Level } from '../../models/level';
import { UserCourse } from '../../models/user-course';
import { IslandTemplate } from '../../models/island-template';
import { IslandBackgroundImage } from '../../models/island-background-image';

const router = express.Router();

router.get('/api/course-mgmt/:course_id/islands', async (req: Request, res: Response) => {
  const courseId = req.params.course_id;
  const course = await Course.findByPk(courseId);

  if (!course) {
    throw new NotFoundError();
  }

  const user_course = await UserCourse.findOne({
    where: {
      courseId: course.id,
      studentId: req.currentUser!.id,
    },
  });

  if (course.teacherId !== req.currentUser!.id && !user_course) {
    throw new NotAuthorizedError();
  }

  const islands = await Island.findAll({
    where: {
      courseId: course.id,
    },
    include: [
      {
        model: Level,
        as: 'Levels',
        required: false,
        separate: true,
        order: [['position', 'ASC']],
      },
      {
        model: Island,
        as: 'prerequisites',
        required: false,
        attributes: ['id', 'name'],
      },
      {
        model: IslandTemplate,
        as: 'template',
        required: false,
      },
      {
        model: IslandBackgroundImage,
        as: 'backgroundImage',
        required: false,
      },
    ],
    order: [
      ['position', 'ASC'],
      ['created_at', 'DESC'],
    ],
  });

  res.send(islands);
});

export { router as indexIslandRouter };
