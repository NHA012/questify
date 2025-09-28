import express, { Request, Response } from 'express';
import { BadRequestError, ResourcePrefix, validateRequest } from '@datn242/questify-common';
import { Course } from '../../models/course';
import { Island } from '../../models/island';
import { Level } from '../../models/level';
import { User } from '../../models/user';
import { UserCourse } from '../../models/user-course';
import { UserIsland } from '../../models/user-island';
import { UserLevel } from '../../models/user-level';
import { query } from 'express-validator';

const router = express.Router();

router.get(
  ResourcePrefix.CourseLearning + '/progress',
  [
    query('student-id')
      .exists()
      .withMessage('student-id is required')
      .isUUID()
      .withMessage('student-id must be a valid UUID'),
    query('course-id').optional().isUUID().withMessage('course-id must be a valid UUID'),
    query('island-id').optional().isUUID().withMessage('island-id must be a valid UUID'),
    query('level-id').optional().isUUID().withMessage('level-id must be a valid UUID'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const student_id = req.query['student-id'] as string;
    const course_id = req.query['course-id'] as string | undefined;
    const island_id = req.query['island-id'] as string | undefined;
    const level_id = req.query['level-id'] as string | undefined;

    const student = await User.findByPk(student_id);
    if (!student) {
      throw new BadRequestError('Student not found');
    }

    if (level_id) {
      return await getLevelProgress(level_id, student.id, req, res);
    } else if (island_id) {
      return await getIslandProgress(island_id, student.id, req, res);
    } else if (course_id) {
      return await getCourseProgress(course_id, student.id, req, res);
    } else {
      throw new BadRequestError('At least 1 of Course ID, Island ID or Level ID is required.');
    }
  },
);

const getLevelProgress = async (
  level_id: string,
  student_id: string,
  req: Request,
  res: Response,
) => {
  const level = await Level.findByPk(level_id);
  if (!level) {
    throw new BadRequestError('Level not found');
  }

  const progress = await UserLevel.findOne({
    where: {
      levelId: level.id,
      userId: student_id,
    },
  });

  res.send({ progress });
};

const getIslandProgress = async (
  island_id: string,
  student_id: string,
  req: Request,
  res: Response,
) => {
  const island = await Island.findByPk(island_id);
  if (!island) {
    throw new BadRequestError('Island not found');
  }

  const progress = await UserIsland.findOne({
    where: {
      islandId: island.id,
      userId: student_id,
    },
  });

  res.send({ progress });
};

const getCourseProgress = async (
  course_id: string,
  student_id: string,
  req: Request,
  res: Response,
) => {
  const course = await Course.findByPk(course_id);
  if (!course) {
    throw new BadRequestError('Course not found');
  }

  const progress = await UserCourse.findOne({
    where: {
      courseId: course.id,
      userId: student_id,
    },
  });

  res.send({ progress });
};

export { router as showProgressRouter };
