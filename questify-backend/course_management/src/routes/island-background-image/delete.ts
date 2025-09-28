import express, { Request, Response } from 'express';
import {
  requireAuth,
  NotFoundError,
  BadRequestError,
  ResourcePrefix,
} from '@datn242/questify-common';
import { IslandBackgroundImage } from '../../models/island-background-image';
import { sequelize } from '../../config/db';
import { Island } from '../../models/island';

const router = express.Router();

router.delete(
  `${ResourcePrefix.CourseManagement}/island-background-images/:id`,
  requireAuth,
  async (req: Request, res: Response) => {
    const { id } = req.params;

    const transaction = await sequelize.transaction();

    try {
      const backgroundImage = await IslandBackgroundImage.findByPk(id, { transaction });

      if (!backgroundImage) {
        throw new NotFoundError();
      }

      if (backgroundImage.isDeleted) {
        throw new BadRequestError('This background image is already deleted');
      }

      // Check if this background image is being used
      const islandCount = await Island.count({
        where: {
          islandBackgroundImageId: id,
          isDeleted: false,
        },
        transaction,
      });

      if (islandCount > 0) {
        throw new BadRequestError('Cannot delete background image that is in use by islands');
      }

      backgroundImage.isDeleted = true;
      backgroundImage.deletedAt = new Date();
      await backgroundImage.save({ transaction });

      await transaction.commit();

      res.status(200).send(backgroundImage);
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  },
);

export { router as deleteIslandBackgroundImageRouter };
