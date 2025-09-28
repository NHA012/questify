import express, { Request, Response } from 'express';
import { NotFoundError, ResourcePrefix } from '@datn242/questify-common';
import { Course } from '../../models/course';
import { Island } from '../../models/island';
import { IslandTemplate } from '../../models/island-template';
import { IslandBackgroundImage } from '../../models/island-background-image';

const router = express.Router();

router.get(
  ResourcePrefix.CourseManagement + '/:course_id/islands/:island_id',
  async (req: Request, res: Response) => {
    const { course_id, island_id } = req.params;
    const course = await Course.findByPk(course_id);

    if (!course) {
      throw new NotFoundError();
    }

    const island = await Island.findOne({
      where: {
        id: island_id,
        courseId: course_id,
      },
      include: [
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
    });

    if (!island) {
      throw new NotFoundError();
    }

    res.send(island);
  },
);

export { router as showIslandRouter };
