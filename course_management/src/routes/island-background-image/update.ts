import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import {
  requireAuth,
  validateRequest,
  NotFoundError,
  ResourcePrefix,
} from '@datn242/questify-common';
import { IslandBackgroundImage } from '../../models/island-background-image';
import { sequelize } from '../../config/db';

const router = express.Router();

router.put(
  `${ResourcePrefix.CourseManagement}/island-background-images/:id`,
  requireAuth,
  [body('imageUrl').notEmpty().withMessage('Image URL is required')],
  validateRequest,
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const { imageUrl } = req.body;

    const transaction = await sequelize.transaction();

    try {
      const backgroundImage = await IslandBackgroundImage.findByPk(id, { transaction });

      if (!backgroundImage) {
        throw new NotFoundError();
      }

      backgroundImage.set({
        imageUrl,
      });

      await backgroundImage.save({ transaction });
      await transaction.commit();

      res.send(backgroundImage);
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  },
);

export { router as updateIslandBackgroundImageRouter };
