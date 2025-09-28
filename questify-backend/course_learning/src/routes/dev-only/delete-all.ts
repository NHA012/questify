import express, { Request, Response } from 'express';
import {
  ResourcePrefix,
  EnvStage,
  BadRequestError,
  validateRequest,
} from '@datn242/questify-common';
import { body } from 'express-validator';
import { sequelize } from '../../config/db';

const router = express.Router();

router.delete(
  ResourcePrefix.CourseLearning + '/admin/deletion',
  [body('deleteKey').isString().withMessage('Service must be valid')],
  validateRequest,
  async (req: Request, res: Response) => {
    const { deleteKey } = req.body;

    if (process.env.NODE_ENV === EnvStage.Prod) {
      throw new BadRequestError('This route is only available in development');
    }

    if (deleteKey !== 'CourseLearningDelete') {
      throw new BadRequestError('Invalid delete key');
    }

    await sequelize.sync({ force: true });

    res.status(200).send({
      message: 'All user records deleted successfully',
    });
  },
);

export { router as deleteAllRouter };
