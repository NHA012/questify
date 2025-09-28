import express, { Request, Response } from 'express';
import { requireAuth, ResourcePrefix, requireAdmin } from '@datn242/questify-common';
import { User } from '../../models/user';

const router = express.Router();

router.get(
  `${ResourcePrefix.Admin}/users`,
  requireAuth,
  requireAdmin,
  async (req: Request, res: Response) => {
    const users = await User.findAll({
      order: [['createdAt', 'DESC']],
      attributes: {
        exclude: ['deletedAt'],
      },
    });

    res.status(200).send(users);
  },
);

export { router as indexUserRouter };
