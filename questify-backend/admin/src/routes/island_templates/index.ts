import express, { Request, Response } from 'express';
import { requireAuth, ResourcePrefix, requireAdmin } from '@datn242/questify-common';
import { IslandTemplate } from '../../models/island-template';

const router = express.Router();

router.get(
  `${ResourcePrefix.Admin}/island-templates`,
  requireAuth,
  requireAdmin,
  async (req: Request, res: Response) => {
    const templates = await IslandTemplate.findAll({
      where: {
        isDeleted: false,
      },
      order: [['createdAt', 'DESC']],
      attributes: {
        exclude: ['deletedAt'],
      },
    });

    res.status(200).send(templates);
  },
);

export { router as indexIslandTemplateRouter };
