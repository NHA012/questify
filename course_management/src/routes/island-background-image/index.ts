import express, { Request, Response } from 'express';
import { requireAuth, ResourcePrefix } from '@datn242/questify-common';
import { IslandBackgroundImage } from '../../models/island-background-image';

const router = express.Router();

router.get(
  `${ResourcePrefix.CourseManagement}/island-background-images`,
  requireAuth,
  async (req: Request, res: Response) => {
    try {
      const backgroundImages = await IslandBackgroundImage.findAll();
      res.send(backgroundImages);
    } catch (error) {
      console.error('Error fetching island background images:', error);
      res.status(500).send({ message: 'Failed to fetch island background images' });
    }
  },
);

export { router as getIslandBackgroundImagesRouter };
