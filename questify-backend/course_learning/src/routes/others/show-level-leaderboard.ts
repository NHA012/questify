import express, { Request, Response } from 'express';
import { NotFoundError, validateRequest, ResourcePrefix } from '@datn242/questify-common';
import { param } from 'express-validator';
import { Level } from '../../models/level';
import { User } from '../../models/user';
import { UserLevel } from '../../models/user-level';

const router = express.Router();

router.get(
  ResourcePrefix.CourseLearning + '/levels/:level_id/leaderboard',
  [param('level_id').isUUID().withMessage('level_id must be a valid UUID')],
  validateRequest,
  async (req: Request, res: Response) => {
    const { level_id } = req.params;

    const level = await Level.findByPk(level_id);
    if (!level) {
      throw new NotFoundError();
    }

    const userLevels = await UserLevel.findAll({
      where: {
        levelId: level.id,
      },
      attributes: ['id', 'userId', 'point', 'finishedDate', 'createdAt'],
      order: [['point', 'DESC']],
    });

    const userIds = userLevels.map((ul) => ul.userId);

    const users = await User.findAll({
      where: {
        id: userIds,
      },
      attributes: ['id', 'userName'],
    });

    const userMap = new Map();
    users.forEach((user) => {
      userMap.set(user.id, user.userName);
    });

    let rank = 1;
    const rankedLeaderboard = userLevels.map((userLevel) => {
      let completionTime = null;

      const createdAt = userLevel.getDataValue('createdAt');

      if (userLevel.finishedDate && createdAt) {
        const diffMs = userLevel.finishedDate.getTime() - new Date(createdAt).getTime();

        const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

        completionTime = `${days} days ${hours} hours ${minutes} minutes`;
      }

      return {
        rank: rank++,
        studentId: userLevel.userId,
        studentName: userMap.get(userLevel.userId) || 'Unknown User',
        points: userLevel.point,
        completionTime,
      };
    });

    res.status(200).send(rankedLeaderboard);
  },
);

export { router as showLevelLeaderboardRouter };
