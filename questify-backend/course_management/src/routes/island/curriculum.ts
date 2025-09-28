import express, { Request, Response } from 'express';
import { Course } from '../../models/course';
import { NotFoundError } from '@datn242/questify-common';
import { Island } from '../../models/island';
import { Level } from '../../models/level';

const router = express.Router();

router.get('/api/course-mgmt/:course_id/curriculum', async (req: Request, res: Response) => {
  const courseId = req.params.course_id;
  const course = await Course.findByPk(courseId);

  if (!course) {
    throw new NotFoundError();
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
        attributes: ['id', 'name', 'position', 'contentType'],
        order: [['position', 'ASC']],
      },
    ],
    attributes: ['id', 'name', 'position', 'description'],
    order: [['position', 'ASC']],
  });

  res.send(islands);
});

export { router as indexCurriculumRouter };
