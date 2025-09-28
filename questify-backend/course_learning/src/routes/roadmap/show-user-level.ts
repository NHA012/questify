import express, { Request, Response } from 'express';
import {
  BadRequestError,
  NotFoundError,
  requireAuth,
  ResourcePrefix,
} from '@datn242/questify-common';
import { User } from '../../models/user';
import { UserLevel } from '../../models/user-level';
import { Level } from '../../models/level';
import { Island } from '../../models/island';
import { Op } from 'sequelize';

const router = express.Router();

router.get(
  ResourcePrefix.CourseLearning + '/roadmap/islands/:island_id',
  requireAuth,
  async (req: Request, res: Response) => {
    const { island_id } = req.params;

    const island = await Island.findByPk(island_id);
    if (!island) {
      throw new NotFoundError();
    }

    const student = await User.findByPk(req.currentUser!.id);
    if (!student) {
      throw new BadRequestError('Current student not found');
    }

    const levels = await Level.findAll({
      where: {
        islandId: island.id,
      },
    });
    if (levels.length === 0) {
      res.send({ userLevels: [] });
    }
    const levelIds = levels.map((level) => level.id);

    const userLevels = await UserLevel.findAll({
      where: {
        userId: student.id,
        levelId: {
          [Op.in]: levelIds,
        },
      },
      include: [
        {
          model: Level,
        },
      ],
      order: [['Level', 'position', 'ASC']],
    });
    res.send({ userLevels });
  },
);

export { router as showUserLevelRouter };
