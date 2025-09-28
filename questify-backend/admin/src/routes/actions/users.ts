import express, { Request, Response } from 'express';
import { requireAuth, ResourcePrefix, requireAdmin } from '@datn242/questify-common';
import { AdminUser } from '../../models/admin-user';
import { User } from '../../models/user';

const router = express.Router();

router.get(
  `${ResourcePrefix.Admin}/actions/users`,
  requireAuth,
  requireAdmin,
  async (req: Request, res: Response) => {
    const adminActions = await AdminUser.findAll({
      order: [['createdAt', 'DESC']],
    });

    const actionsWithRelations = await Promise.all(
      adminActions.map(async (action) => {
        const admin = await User.findByPk(action.adminId, {
          attributes: ['id', 'userName', 'gmail'],
        });

        const targetUser = await User.findByPk(action.userId, {
          attributes: ['id', 'userName', 'gmail', 'role', 'status'],
        });

        return {
          ...action.toJSON(),
          admin: admin ? admin.toJSON() : null,
          targetUser: targetUser ? targetUser.toJSON() : null,
        };
      }),
    );

    res.status(200).send(actionsWithRelations);
  },
);

export { router as userActionsRouter };
