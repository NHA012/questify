import express, { Request, Response } from 'express';
import { Course } from '../../models/course';
import {
  NotAuthorizedError,
  requireAuth,
  NotFoundError,
  BadRequestError,
} from '@datn242/questify-common';
import { Island } from '../../models/island';
import { PrerequisiteIsland } from '../../models/prerequisiteIsland';
import { Op } from 'sequelize';
import { sequelize } from '../../config/db';
import { recalculatePositions } from '../../services/island';
import { IslandUpdatedPublisher } from '../../events/publishers/island-updated-publisher';
import { natsWrapper } from '../../nats-wrapper';

const router = express.Router();

router.delete(
  '/api/course-mgmt/:course_id/islands/:island_id',
  requireAuth,
  async (req: Request, res: Response) => {
    const { course_id, island_id } = req.params;

    try {
      const result = await sequelize.transaction(async (transaction) => {
        const course = await Course.findByPk(course_id, { transaction });

        if (!course) {
          throw new NotFoundError();
        }

        if (course.teacherId !== req.currentUser!.id) {
          throw new NotAuthorizedError();
        }

        if (course.isDeleted) {
          throw new BadRequestError('Course is already deleted');
        }

        const island = await Island.findOne({
          where: {
            id: island_id,
            courseId: course_id,
          },
          transaction,
        });

        if (!island) {
          throw new NotFoundError();
        }

        if (island.isDeleted) {
          throw new BadRequestError('Island is already deleted');
        }

        await PrerequisiteIsland.destroy({
          where: {
            [Op.or]: [{ islandId: island_id }, { prerequisiteIslandId: island_id }],
          },
          transaction,
        });

        island.set({ isDeleted: true });

        new IslandUpdatedPublisher(natsWrapper.client).publish(island);
        await island.save({ transaction });

        await recalculatePositions(course_id, transaction, false);

        return island;
      });

      res.send(result);
    } catch (error) {
      if (
        error instanceof NotFoundError ||
        error instanceof NotAuthorizedError ||
        error instanceof BadRequestError
      ) {
        throw error;
      }
      console.error('Error deleting island:', error);
      throw new BadRequestError('Failed to delete island');
    }
  },
);

export { router as deleteIslandRouter };
