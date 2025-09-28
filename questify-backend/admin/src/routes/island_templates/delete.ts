import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import {
  requireAuth,
  validateRequest,
  NotFoundError,
  BadRequestError,
  ResourcePrefix,
  requireAdmin,
} from '@datn242/questify-common';
import { IslandTemplate } from '../../models/island-template';
import { sequelize } from '../../config/db';
import { natsWrapper } from '../../nats-wrapper';
import { IslandTemplateUpdatedPublisher } from '../../events/publishers/island-template-updated-publisher';

const router = express.Router();

router.delete(
  `${ResourcePrefix.Admin}/island-templates/:template_id`,
  requireAuth,
  requireAdmin,
  [
    body('reason')
      .optional({ nullable: true })
      .isString()
      .withMessage('Reason must be a string if provided'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { template_id } = req.params;
    // const { reason } = req.body;
    // const adminId = req.currentUser!.id;

    const islandTemplate = await IslandTemplate.findByPk(template_id);

    if (!islandTemplate) {
      throw new NotFoundError();
    }

    if (islandTemplate.isDeleted) {
      throw new BadRequestError('This template is already deleted');
    }

    const transaction = await sequelize.transaction();

    try {
      islandTemplate.isDeleted = true;
      islandTemplate.deletedAt = new Date();
      await islandTemplate.save({ transaction });

      // const adminAction = await AdminIslandTemplate.create(
      //   {
      //     adminId,
      //     islandTemplateId: template_id,
      //     reason: reason || '',
      //     actionType: AdminIslandTemplateActionType.Remove,
      //   },
      //   { transaction },
      // );

      // await adminAction.reload({
      //   transaction,
      //   include: [
      //     {
      //       model: IslandTemplate,
      //       as: 'islandTemplate',
      //     },
      //   ],
      // });

      await transaction.commit();

      // Publish update event after successful transaction
      await new IslandTemplateUpdatedPublisher(natsWrapper.client).publish({
        id: islandTemplate.id,
        isDeleted: islandTemplate.isDeleted,
        deletedAt: islandTemplate.deletedAt,
      });

      res.status(200).send({
        ...islandTemplate.toJSON(),
        // adminAction: adminAction.toJSON(),
      });
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  },
);

export { router as deleteIslandTemplateRouter };
