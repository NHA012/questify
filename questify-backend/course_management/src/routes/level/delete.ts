import express, { Request, Response } from 'express';
import { Course } from '../../models/course';
import {
  NotAuthorizedError,
  requireAuth,
  NotFoundError,
  BadRequestError,
} from '@datn242/questify-common';
import { Island } from '../../models/island';
import { Level } from '../../models/level';
import { LevelUpdatedPublisher } from '../../events/publishers/level-updated-publisher';
import { natsWrapper } from '../../nats-wrapper';

const router = express.Router();

router.delete(
  '/api/course-mgmt/islands/:island_id/level/:level_id',
  requireAuth,
  async (req: Request, res: Response) => {
    const { island_id, level_id } = req.params;
    const island = await Island.findByPk(island_id, {
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

    if (island.isDeleted) {
      throw new BadRequestError('Island is already deleted');
    }

    const level = await Level.findOne({
      where: {
        id: level_id,
        islandId: island_id,
      },
    });

    if (!level) {
      throw new NotFoundError();
    }

    if (level.isDeleted) {
      throw new BadRequestError('Level is already deleted');
    }

    level.set({
      isDeleted: true,
    });

    new LevelUpdatedPublisher(natsWrapper.client).publish({
      ...level,
      teacherId: course.teacherId,
    });

    await level.save();

    res.send(level);
  },
);

export { router as deleteLevelRouter };
