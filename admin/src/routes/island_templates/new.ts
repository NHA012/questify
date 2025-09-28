import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import {
  requireAuth,
  validateRequest,
  BadRequestError,
  ResourcePrefix,
  requireAdmin,
} from '@datn242/questify-common';
import { IslandTemplate } from '../../models/island-template';
import {
  AdminIslandTemplate,
  AdminIslandTemplateActionType,
} from '../../models/admin-island-template';
import { sequelize } from '../../config/db';
import { natsWrapper } from '../../nats-wrapper';
import { IslandTemplateCreatedPublisher } from '../../events/publishers/island-template-created-publisher';

const router = express.Router();

router.post(
  `${ResourcePrefix.Admin}/island-templates`,
  requireAuth,
  requireAdmin,
  [
    body('name').notEmpty().withMessage('Name is required'),
    body('imageUrl').notEmpty().withMessage('Image URL is required'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { name, imageUrl } = req.body;
    const adminId = req.currentUser!.id;

    const existingTemplate = await IslandTemplate.findOne({
      where: {
        name,
        isDeleted: false,
      },
    });

    if (existingTemplate) {
      throw new BadRequestError('A template with this name already exists');
    }

    const transaction = await sequelize.transaction();

    try {
      const islandTemplate = await IslandTemplate.create(
        {
          name,
          imageUrl,
        },
        { transaction },
      );

      const adminAction = await AdminIslandTemplate.create(
        {
          adminId,
          islandTemplateId: islandTemplate.id,
          actionType: AdminIslandTemplateActionType.Add,
        },
        { transaction },
      );

      await adminAction.reload({
        transaction,
        include: [
          {
            model: IslandTemplate,
            as: 'islandTemplate',
          },
        ],
      });

      await transaction.commit();

      // Publish event after successful transaction
      await new IslandTemplateCreatedPublisher(natsWrapper.client).publish({
        id: islandTemplate.id,
        name: islandTemplate.name,
        image_url: islandTemplate.imageUrl,
      });

      res.status(201).send({
        ...islandTemplate.toJSON(),
        adminAction: adminAction.toJSON(),
      });
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  },
);

export { router as newIslandTemplateRouter };
