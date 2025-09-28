import express, { Request, Response } from 'express';
import {
  BadRequestError,
  NotFoundError,
  requireAuth,
  ResourcePrefix,
} from '@datn242/questify-common';
import { User } from '../../models/user';
import { UserIsland } from '../../models/user-island';
import { Island } from '../../models/island';
import { Course } from '../../models/course';
import { Op } from 'sequelize';

const router = express.Router();

router.get(
  ResourcePrefix.CourseLearning + '/roadmap/courses/:course_id',
  requireAuth,
  async (req: Request, res: Response) => {
    const { course_id } = req.params;
    const course = await Course.findByPk(course_id);
    if (!course) {
      throw new NotFoundError();
    }
    const student = await User.findByPk(req.currentUser!.id);
    if (!student) {
      throw new BadRequestError('Current student not found');
    }
    const islands = await Island.findAll({
      where: {
        courseId: course.id,
      },
    });
    if (islands.length === 0) {
      res.send({ userIslands: [] });
    }
    const islandIds = islands.map((island) => island.id);
    const userIslands = await UserIsland.findAll({
      where: {
        userId: student.id,
        islandId: {
          [Op.in]: islandIds,
        },
      },
      include: [
        {
          model: Island,
          // Don't specify 'as' here
        },
      ],
      order: [
        ['Island', 'position', 'ASC'], // Note the capital 'I' in 'Island'
      ],
    });
    res.send({ userIslands });
  },
);

export { router as showUserIslandRouter };
