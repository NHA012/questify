import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import {
  validateRequest,
  BadRequestError,
  ResourcePrefix,
  EnvStage,
} from '@datn242/questify-common';
import { User } from '../../models/user';

const router = express.Router();

router.delete(
  ResourcePrefix.Auth + '/deletion',
  [body('deleteKey').isString().withMessage('Auth SRV: deleteKey must be valid')],
  validateRequest,
  async (req: Request, res: Response) => {
    const { deleteKey } = req.body;

    if (process.env.NODE_ENV === EnvStage.Prod) {
      throw new BadRequestError('This route is only available in development');
    }

    if (deleteKey !== 'AuthDelete') {
      throw new BadRequestError('Invalid delete key');
    }

    const result = await User.deleteMany({});

    res.status(200).send({
      message: 'All user records deleted successfully',
      deletedCount: result.deletedCount,
    });
  },
);

export { router as deleteUserRouter };
