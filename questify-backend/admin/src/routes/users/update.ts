import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import {
  requireAuth,
  validateRequest,
  UserStatus,
  NotFoundError,
  BadRequestError,
  ResourcePrefix,
  requireAdmin,
  UserRole,
} from '@datn242/questify-common';
import { User } from '../../models/user';
// import { AdminUser, AdminActionType } from '../../models/admin-user';
import { sequelize } from '../../config/db';

const router = express.Router();

router.patch(
  `${ResourcePrefix.Admin}/users/:user_id`,
  requireAuth,
  requireAdmin,
  [
    body('status')
      .isIn([UserStatus.Active, UserStatus.Suspended])
      .withMessage('Status must be either Active or Suspended'),
    body('reason')
      .optional({ nullable: true })
      .isString()
      .withMessage('Reason must be a string if provided'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { user_id } = req.params;
    const { status } = req.body;
    // const adminId = req.currentUser!.id;

    const user = await User.findByPk(user_id);

    if (!user) {
      throw new NotFoundError();
    }

    if (user.role === UserRole.Admin && status === UserStatus.Suspended) {
      throw new BadRequestError('Admins cannot suspend other admins');
    }

    const transaction = await sequelize.transaction();

    try {
      user.status = status;
      await user.save({ transaction });

      // let adminAction;
      // if (status === UserStatus.Suspended) {
      //   adminAction = await AdminUser.create(
      //     {
      //       adminId,
      //       userId: user_id,
      //       reason: reason || '',
      //       actionType: AdminActionType.Suspend,
      //     },
      //     { transaction },
      //   );

      //   await adminAction.reload({
      //     transaction,
      //     include: [
      //       {
      //         model: User,
      //         as: 'admin',
      //         attributes: ['id', 'userName', 'gmail'],
      //       },
      //     ],
      //   });
      // } else {
      //   adminAction = await AdminUser.create(
      //     {
      //       adminId,
      //       userId: user_id,
      //       reason: reason || '',
      //       actionType: AdminActionType.Unsuspend,
      //     },
      //     { transaction },
      //   );

      //   await adminAction.reload({
      //     transaction,
      //     include: [
      //       {
      //         model: User,
      //         as: 'admin',
      //         attributes: ['id', 'userName', 'gmail'],
      //       },
      //     ],
      //   });
      // }

      await transaction.commit();

      res.status(200).send({
        ...user.toJSON(),
        // adminAction: adminAction ? adminAction.toJSON() : undefined,
      });
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  },
);

export { router as updateUserRouter };
