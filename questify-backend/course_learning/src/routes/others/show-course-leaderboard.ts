import express, { Request, Response } from 'express';
import { NotFoundError, validateRequest, ResourcePrefix } from '@datn242/questify-common';
import { param } from 'express-validator';
import { Course } from '../../models/course';
import { User } from '../../models/user';
import { UserCourse } from '../../models/user-course';

const router = express.Router();

router.get(
  ResourcePrefix.CourseLearning + '/courses/:course_id/leaderboard',
  [param('course_id').isUUID().withMessage('course_id must be a valid UUID')],
  validateRequest,
  async (req: Request, res: Response) => {
    const { course_id } = req.params;

    const course = await Course.findByPk(course_id);

    if (!course) {
      throw new NotFoundError();
    }

    const leaderboard = await UserCourse.findAll({
      where: {
        courseId: course.id,
      },
      include: [
        {
          model: User,
          attributes: ['id', 'userName'],
        },
      ],
      attributes: ['id', 'point', 'finishedDate', 'createdAt'],
      order: [['point', 'DESC']],
    });

    let rank = 1;
    const rankedLeaderboard = leaderboard.map((progress) => {
      let completionTime = null;

      const createdAt = progress.getDataValue('createdAt');

      if (progress.finishedDate && createdAt) {
        const diffMs = progress.finishedDate.getTime() - new Date(createdAt).getTime();

        const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

        completionTime = `${days} days ${hours} hours ${minutes} minutes`;
      }

      return {
        rank: rank++,
        studentId: progress.User!.id,
        studentName: progress.User!.userName,
        points: progress.point,
        completionTime,
      };
    });

    res.status(200).send(rankedLeaderboard);
  },
);

export { router as showLeaderboardRouter };
