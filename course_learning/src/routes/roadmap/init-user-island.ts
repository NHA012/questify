import express, { Request, Response } from 'express';
import { requireAuth, ResourcePrefix } from '@datn242/questify-common';
import { initializeUserIslands } from '../../services/init-user-island.service';

const router = express.Router();

router.post(
  ResourcePrefix.CourseLearning + '/roadmap/courses/:course_id',
  requireAuth,
  async (req: Request, res: Response) => {
    const { course_id } = req.params;
    const userIslands = await initializeUserIslands(course_id, req.currentUser!.id);

    res.status(201).send({ userIslands });
  },
);

export { router as initUserIslandRouter };
