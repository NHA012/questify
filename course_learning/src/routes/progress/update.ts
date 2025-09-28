import express, { Request, Response } from 'express';
import {
  CompletionStatus,
  BadRequestError,
  ResourcePrefix,
  validateRequest,
  requireAuth,
  NotAuthorizedError,
} from '@datn242/questify-common';
import { Course } from '../../models/course';
import { Island } from '../../models/island';
import { Level } from '../../models/level';
import { User } from '../../models/user';
import { UserCourse } from '../../models/user-course';
import { UserIsland } from '../../models/user-island';
import { UserLevel } from '../../models/user-level';
import { param, body } from 'express-validator';
import {
  updateIslandPoints,
  updateCoursePoints,
  unlockNextLevel,
  checkAndUpdateIslandStatus,
  unlockDependentIslands,
  checkAndUpdateCourseStatus,
} from '../../services/progress-helper';

const router = express.Router();

// Update User Course
router.patch(
  ResourcePrefix.CourseLearning + '/progress/students/:student_id/courses/:course_id',
  requireAuth,
  [
    param('student_id').isUUID().withMessage('student_id must be a valid UUID'),
    param('course_id').isUUID().withMessage('course_id must be a valid UUID'),
    body('point').optional().isNumeric().withMessage('point must be a number'),
    body('completion_status')
      .optional()
      .isIn([
        CompletionStatus.Completed,
        CompletionStatus.InProgress,
        CompletionStatus.Fail,
        CompletionStatus.Locked,
      ])
      .withMessage('status must be one of CompletionStatus'),
    body('finished_date').optional().isDate().withMessage('finished_date must be a valid date'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const student_id = req.params['student_id'] as string;
    const course_id = req.params['course_id'] as string;
    const { point, completion_status, finished_date } = req.body;

    const student = await User.findByPk(student_id);
    if (!student) {
      throw new BadRequestError('Student not found');
    }

    const course = await Course.findByPk(course_id);
    if (!course) {
      throw new BadRequestError('Course not found');
    }

    const progress = await UserCourse.findOne({
      where: {
        userId: student_id,
        courseId: course_id,
      },
    });

    if (!progress) {
      throw new BadRequestError('Progress not found');
    }

    if (req.currentUser!.id !== progress.userId) {
      throw new NotAuthorizedError();
    }

    const updateFields: Partial<UserCourse> = {};
    if (point !== undefined) updateFields['point'] = point;
    if (completion_status !== undefined) updateFields['completionStatus'] = completion_status;
    if (finished_date !== undefined) updateFields['finishedDate'] = finished_date;

    await progress.update(updateFields);

    res.send(progress);
  },
);

// Update User Island
router.patch(
  ResourcePrefix.CourseLearning + '/progress/students/:student_id/islands/:island_id',
  requireAuth,
  [
    param('student_id').isUUID().withMessage('student_id must be a valid UUID'),
    param('island_id').isUUID().withMessage('island_id must be a valid UUID'),
    body('point').optional().isNumeric().withMessage('point must be a number'),
    body('completion_status')
      .optional()
      .isIn([
        CompletionStatus.Completed,
        CompletionStatus.InProgress,
        CompletionStatus.Fail,
        CompletionStatus.Locked,
      ])
      .withMessage('status must be one of CompletionStatus'),
    body('finished_date').optional().isDate().withMessage('finished_date must be a valid date'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const student_id = req.params['student_id'] as string;
    const island_id = req.params['island_id'] as string;
    const { point, completion_status, finished_date } = req.body;

    const student = await User.findByPk(student_id);
    if (!student) {
      throw new BadRequestError('Student not found');
    }

    const island = await Island.findByPk(island_id);
    if (!island) {
      throw new BadRequestError('Island not found');
    }

    const userIsland = await UserIsland.findOne({
      where: {
        userId: student_id,
        islandId: island_id,
      },
    });

    if (!userIsland) {
      throw new BadRequestError('User island not found');
    }

    if (req.currentUser!.id !== userIsland.userId) {
      throw new NotAuthorizedError();
    }

    const oldPoint = userIsland.point;
    let pointDifference = 0;

    const updateFields: Partial<UserIsland> = {};
    if (point !== undefined) {
      updateFields['point'] = point;
      pointDifference = point - oldPoint;
    }
    if (completion_status !== undefined) updateFields['completionStatus'] = completion_status;
    if (finished_date !== undefined) updateFields['finishedDate'] = finished_date;

    await userIsland.update(updateFields);

    // If points changed, propagate to the course
    if (pointDifference !== 0) {
      await updateCoursePoints(student_id, island.courseId, pointDifference);
    }

    // If status changed to Completed, check if all islands in course are completed
    if (
      completion_status === CompletionStatus.Completed &&
      userIsland.completionStatus !== CompletionStatus.Completed
    ) {
      // Unlock islands for which this is a prerequisite
      await unlockDependentIslands(student_id, island_id, island.courseId);

      // Check if course is now completed
      await checkAndUpdateCourseStatus(student_id, island.courseId);
    }

    res.send(userIsland);
  },
);

// Update User Level
router.patch(
  ResourcePrefix.CourseLearning + '/progress/students/:student_id/levels/:level_id',
  requireAuth,
  [
    param('student_id').isUUID().withMessage('student_id must be a valid UUID'),
    param('level_id').isUUID().withMessage('level_id must be a valid UUID'),
    body('point').optional().isNumeric().withMessage('point must be a number'),
    body('completion_status')
      .optional()
      .isIn([
        CompletionStatus.Completed,
        CompletionStatus.InProgress,
        CompletionStatus.Fail,
        CompletionStatus.Locked,
      ])
      .withMessage('status must be one of CompletionStatus'),
    body('finished_date').optional().isDate().withMessage('finished_date must be a valid date'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const student_id = req.params['student_id'] as string;
    const level_id = req.params['level_id'] as string;
    const { point, completion_status, finished_date } = req.body;

    const student = await User.findByPk(student_id);
    if (!student) {
      throw new BadRequestError('Student not found');
    }

    const level = await Level.findByPk(level_id);
    if (!level) {
      throw new BadRequestError('Level not found');
    }

    // Get island ID for this level
    const island = await Island.findByPk(level.islandId);
    if (!island) {
      throw new BadRequestError('Island not found for this level');
    }

    const userLevel = await UserLevel.findOne({
      where: {
        userId: student_id,
        levelId: level_id,
      },
    });

    if (!userLevel) {
      throw new BadRequestError('User level not found');
    }

    if (req.currentUser!.id !== userLevel.userId) {
      throw new NotAuthorizedError();
    }

    const oldPoint = userLevel.point;
    let pointDifference = 0;
    const oldStatus = userLevel.completionStatus;

    const updateFields: Partial<UserLevel> = {};
    if (point !== undefined) {
      updateFields['point'] = point;
      pointDifference = point - oldPoint;
    }
    if (completion_status !== undefined) updateFields['completionStatus'] = completion_status;
    if (finished_date !== undefined) updateFields['finishedDate'] = finished_date;

    await userLevel.update(updateFields);

    // If points changed, propagate to the island
    if (pointDifference !== 0) {
      await updateIslandPoints(student_id, level.islandId, pointDifference);
    }

    // If status changed to Completed
    if (
      completion_status === CompletionStatus.Completed &&
      oldStatus !== CompletionStatus.Completed
    ) {
      // Unlock the next level in the same island
      await unlockNextLevel(student_id, level.islandId, level.position);

      // Check if all levels in island are completed
      await checkAndUpdateIslandStatus(student_id, level.islandId);
    }

    res.send(userLevel);
  },
);

export { router as updateProgressRouter };
