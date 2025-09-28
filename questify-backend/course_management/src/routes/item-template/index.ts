import express, { Request, Response } from 'express';
import { ItemTemplate } from '../../models/item-template';
import { ResourcePrefix, requireAuth } from '@datn242/questify-common';

const router = express.Router();

router.get(
  ResourcePrefix.CourseManagement + '/templates/all',
  requireAuth,
  async (req: Request, res: Response) => {
    const itemTemplates = await ItemTemplate.findAll({
      where: { isDeleted: false },
      order: [['name', 'ASC']],
    });

    res.send(itemTemplates);
  },
);

export { router as indexItemTemplateRouter };
