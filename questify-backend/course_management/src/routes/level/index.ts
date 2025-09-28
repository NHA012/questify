import express, { Request, Response } from 'express';
import { Course } from '../../models/course';
import { NotAuthorizedError, NotFoundError } from '@datn242/questify-common';
import { Island } from '../../models/island';
import { Level } from '../../models/level';

const router = express.Router();

router.get('/api/course-mgmt/islands/:island_id/levels', async (req: Request, res: Response) => {
  const islandId = req.params.island_id;
  const island = await Island.findByPk(islandId, {
    include: [
      {
        model: Course,
        as: 'Course',
        required: false,
      },
    ],
  });
  if (!island) {
    throw new NotFoundError();
  }

  const course = island.get('Course') as Course;

  if (course.teacherId !== req.currentUser!.id) {
    throw new NotAuthorizedError();
  }

  const levels = await Level.findAll({
    where: {
      islandId: island.id,
    },
  });

  res.send(levels);
});

export { router as indexLevelRouter };
