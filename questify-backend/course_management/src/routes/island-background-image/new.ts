import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { requireAuth, validateRequest, ResourcePrefix } from '@datn242/questify-common';
import { IslandBackgroundImage } from '../../models/island-background-image';
import { sequelize } from '../../config/db';

const router = express.Router();

router.post(
  `${ResourcePrefix.CourseManagement}/island-background-images`,
  requireAuth,
  [body('imageUrl').notEmpty().withMessage('Image URL is required')],
  validateRequest,
  async (req: Request, res: Response) => {
    const { imageUrl } = req.body;

    const transaction = await sequelize.transaction();

    try {
      const backgroundImage = await IslandBackgroundImage.create(
        {
          imageUrl,
        },
        { transaction },
      );

      await transaction.commit();

      res.status(201).send(backgroundImage);
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  },
);

export { router as newIslandBackgroundImageRouter };
