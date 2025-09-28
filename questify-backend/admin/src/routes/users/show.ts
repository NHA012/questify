import express, { Request, Response } from 'express';
import { requireAuth, NotFoundError, ResourcePrefix, requireAdmin } from '@datn242/questify-common';
import { User } from '../../models/user';

const router = express.Router();

router.get(
  `${ResourcePrefix.Admin}/users/:user_id`,
  requireAuth,
  requireAdmin,
  async (req: Request, res: Response) => {
    const { user_id } = req.params;

    const user = await User.findByPk(user_id);

    if (!user) {
      throw new NotFoundError();
    }

    res.status(200).send(user);
  },
);

export { router as showUserRouter };
