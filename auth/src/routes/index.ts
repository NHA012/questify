import express, { Request, Response } from 'express';
import { NotFoundError } from '@datn242/questify-common';
import { User } from '../models/user';

const router = express.Router();

router.get('/api/users/:user_id', async (req: Request, res: Response) => {
  try {
    const userId = req.params.user_id;
    const user = await User.findById(userId);

    if (!user) {
      throw new NotFoundError();
    }

    res.status(200).send(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    throw new NotFoundError();
  }
});

export { router as getUserRouter };
