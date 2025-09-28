import express, { Request, Response } from 'express';
import { requireAuth, ResourcePrefix, requireAdmin } from '@datn242/questify-common';
import { AdminIslandTemplate } from '../../models/admin-island-template';
import { User } from '../../models/user';
import { IslandTemplate } from '../../models/island-template';

const router = express.Router();

router.get(
  `${ResourcePrefix.Admin}/actions/island-templates`,
  requireAuth,
  requireAdmin,
  async (req: Request, res: Response) => {
    const adminActions = await AdminIslandTemplate.findAll({
      order: [['createdAt', 'DESC']],
    });

    const actionsWithRelations = await Promise.all(
      adminActions.map(async (action) => {
        const admin = await User.findByPk(action.adminId, {
          attributes: ['id', 'userName', 'gmail'],
        });

        const islandTemplate = await IslandTemplate.findByPk(action.islandTemplateId, {
          attributes: ['id', 'name', 'imageUrl', 'isDeleted', 'deletedAt'],
        });

        return {
          ...action.toJSON(),
          admin: admin ? admin.toJSON() : null,
          islandTemplate: islandTemplate ? islandTemplate.toJSON() : null,
        };
      }),
    );

    res.status(200).send(actionsWithRelations);
  },
);

export { router as islandTemplateActionsRouter };
