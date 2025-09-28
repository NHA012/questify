import express from 'express';
import { LevelService } from '../services/level';
import { currentUser } from '@datn242/questify-common';
import { User } from '../models/user';

const router = express.Router();

router.get('/api/users/currentuser', currentUser, async (req, res) => {
  if (!req.currentUser) {
    res.send({ currentUser: null, levelInfo: null });
    return;
  }

  try {
    const freshUserData = await User.findById(req.currentUser.id);

    if (!freshUserData) {
      res.send({
        currentUser: req.currentUser,
        levelInfo: LevelService.getInstance().getLevelInfo(req.currentUser.userExp || 0),
      });
      return;
    }

    const currentExp = freshUserData.exp || 0;

    const updatedCurrentUser = {
      ...req.currentUser,
      userExp: currentExp,
    };

    const levelInfo = LevelService.getInstance().getLevelInfo(currentExp);

    res.send({
      currentUser: updatedCurrentUser,
      levelInfo,
    });
  } catch (error) {
    console.error('Error fetching fresh user data:', error);
    res.send({
      currentUser: req.currentUser,
      levelInfo: LevelService.getInstance().getLevelInfo(req.currentUser.userExp || 0),
    });
  }
});

export { router as currentUserRouter };
