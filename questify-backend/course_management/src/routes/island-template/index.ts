import express, { Request, Response } from 'express';
import { requireAuth, ResourcePrefix } from '@datn242/questify-common';
import { IslandTemplate } from '../../models/island-template';

const router = express.Router();

router.get(
  `${ResourcePrefix.CourseManagement}/island-templates`,
  requireAuth,
  async (req: Request, res: Response) => {
    try {
      const templates = await IslandTemplate.findAll({
        order: [['name', 'ASC']],
      });
      res.send(templates);
    } catch (error) {
      console.error('Error fetching island templates:', error);
      res.status(500).send({ message: 'Failed to fetch island templates' });
    }
  },
);

export { router as getIslandTemplatesRouter };
