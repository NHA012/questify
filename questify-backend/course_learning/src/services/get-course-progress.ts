import { Op } from 'sequelize';
import { Course } from '../models/course';
import { UserCourse } from '../models/user-course';
import { UserLevel } from '../models/user-level';
import { Level } from '../models/level';
import { Island } from '../models/island';
import { CompletionStatus } from '@datn242/questify-common';

interface CourseProgressResponse {
  courses: Array<{
    id: string;
    name: string;
    description?: string;
    thumbnail?: string;
    completionRate: number;
    userCourseStatus: CompletionStatus;
    totalLevels: number;
    completedLevels: number;
  }>;
  total: number;
  page: number;
  pageSize: number;
}

export const getUserCourseProgress = async (userId: string, page: number, pageSize: number) => {
  const offset = (page - 1) * pageSize;

  try {
    const userCourses = await UserCourse.findAndCountAll({
      where: { userId },
      include: [
        {
          model: Course,
          as: 'Course',
        },
      ],
      limit: pageSize,
      offset: offset,
      order: [['createdAt', 'DESC']],
    });

    if (userCourses.count === 0) {
      return {
        courses: [],
        total: 0,
        page,
        pageSize,
      };
    }

    const coursesProgress = await Promise.all(
      userCourses.rows.map(async (userCourse) => {
        const islands = await Island.findAll({
          where: { courseId: userCourse.courseId },
          attributes: ['id'],
        });

        const islandIds = islands.map((island) => island.id);

        const levels = await Level.findAll({
          where: {
            islandId: {
              [Op.in]: islandIds,
            },
          },
        });

        const userLevels = await UserLevel.findAll({
          where: {
            userId,
            levelId: {
              [Op.in]: levels.map((level) => level.id),
            },
          },
        });

        const totalLevels = levels.length;
        const completedLevels = userLevels.filter(
          (ul) => ul.completionStatus === CompletionStatus.Completed,
        ).length;

        const completionRate =
          totalLevels > 0 ? Math.round((completedLevels / totalLevels) * 100) : 0;
        return {
          id: userCourse.courseId,
          name: userCourse.Course?.name || '',
          description: userCourse.Course?.description,
          thumbnail: userCourse.Course?.thumbnail,
          completionRate,
          userCourseStatus: userCourse.completionStatus,
          totalLevels,
          completedLevels,
        };
      }),
    );

    const response: CourseProgressResponse = {
      courses: coursesProgress,
      total: userCourses.count,
      page,
      pageSize,
    };

    return response;
  } catch (error) {
    return {
      message: 'Internal server error',
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
};
