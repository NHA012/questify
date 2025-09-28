import express, { Request, Response } from 'express';
import { NotFoundError, validateRequest, ResourcePrefix } from '@datn242/questify-common';
import { param } from 'express-validator';
import { Island } from '../../models/island';
import { User } from '../../models/user';
import { UserIsland } from '../../models/user-island';

const router = express.Router();

router.get(
  ResourcePrefix.CourseLearning + '/islands/:island_id/leaderboard',
  [param('island_id').isUUID().withMessage('island_id must be a valid UUID')],
  validateRequest,
  async (req: Request, res: Response) => {
    const { island_id } = req.params;

    const island = await Island.findByPk(island_id);
    if (!island) {
      throw new NotFoundError();
    }

    const userIslands = await UserIsland.findAll({
      where: {
        islandId: island.id,
      },
      attributes: ['id', 'userId', 'point', 'finishedDate', 'createdAt'],
      order: [['point', 'DESC']],
    });

    const userIds = userIslands.map((ui) => ui.userId);

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
    const rankedLeaderboard = userIslands.map((userIsland) => {
      let completionTime = null;

      const createdAt = userIsland.getDataValue('createdAt');

      if (userIsland.finishedDate && createdAt) {
        const diffMs = userIsland.finishedDate.getTime() - new Date(createdAt).getTime();

        const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

        completionTime = `${days} days ${hours} hours ${minutes} minutes`;
      }

      return {
        rank: rank++,
        studentId: userIsland.userId,
        studentName: userMap.get(userIsland.userId) || 'Unknown User',
        points: userIsland.point,
        completionTime,
      };
    });

    res.status(200).send(rankedLeaderboard);
  },
);

export { router as showIslandLeaderboardRouter };
