import { BadRequestError, CompletionStatus } from '@datn242/questify-common';
import { User } from '../models/user';
import { Course } from '../models/course';
import { UserCourse } from '../models/user-course';
import { Island } from '../models/island';
import { UserIsland } from '../models/user-island';
import { Level } from '../models/level';
import { UserLevel } from '../models/user-level';
import { sequelize } from '../config/db';
import { Transaction } from 'sequelize';

/**
 * Initialize a user's enrollment in a course with transaction support
 * @param courseId - The ID of the course to enroll in
 * @param userId - The ID of the user to enroll
 * @returns The created or existing UserCourse record
 */
export async function initializeUserCourse(courseId: string, userId: string): Promise<UserCourse> {
  // Start a transaction to ensure data consistency
  const transaction = await sequelize.transaction();

  try {
    // Validate course exists
    const course = await Course.findByPk(courseId, { transaction });
    if (!course) {
      await transaction.rollback();
      throw new BadRequestError('Course not found');
    }

    // Validate user exists
    const student = await User.findByPk(userId, { transaction });
    if (!student) {
      await transaction.rollback();
      throw new BadRequestError('User not found');
    }

    // Check if user is already enrolled
    const existingEnrollment = await UserCourse.findOne({
      where: {
        userId: userId,
        courseId: courseId,
      },
      transaction,
    });

    // If already enrolled, just return the existing enrollment
    if (existingEnrollment) {
      await transaction.commit();
      return existingEnrollment;
    }

    // Create the user-course record
    const userCourse = await UserCourse.create(
      {
        userId: userId,
        courseId: courseId,
        point: 0,
        completionStatus: CompletionStatus.InProgress,
      },
      { transaction },
    );

    // Initialize islands within the same transaction
    const userIslands = await initializeUserIslandsWithTransaction(courseId, userId, transaction);

    // Initialize levels for all islands within the same transaction
    await initializeUserLevelsWithTransaction(userId, userIslands, transaction);

    // Commit the transaction
    await transaction.commit();
    return userCourse;
  } catch (error) {
    // Rollback transaction on any error
    await transaction.rollback();
    console.error(`Error initializing user course: ${error}`);
    throw error;
  }
}

/**
 * Initialize user islands with transaction support
 * This is a private function to be used within initializeUserCourse
 */
async function initializeUserIslandsWithTransaction(
  courseId: string,
  userId: string,
  transaction: Transaction,
): Promise<UserIsland[]> {
  // Find all islands for this course
  const islands = await Island.findAll({
    where: {
      courseId: courseId,
    },
    transaction,
  });

  if (!islands || islands.length === 0) {
    throw new BadRequestError('Islands not found');
  }

  // First check if user islands already exist
  const existingUserIslands = await UserIsland.findAll({
    where: {
      userId: userId,
      islandId: islands.map((island) => island.id),
    },
    transaction,
  });

  // If user islands already exist, return them
  if (existingUserIslands.length === islands.length) {
    return existingUserIslands;
  }

  // Create new user islands only for islands that don't already have user islands
  const existingIslandIds = new Set(existingUserIslands.map((ui) => ui.islandId));
  const userIslandsToCreate = islands.filter((island) => !existingIslandIds.has(island.id));

  const userIslands: UserIsland[] = [];

  // Create user islands for any that don't already exist
  for (const island of userIslandsToCreate) {
    const status = island.position === 0 ? CompletionStatus.InProgress : CompletionStatus.Locked;

    const userIsland = await UserIsland.create(
      {
        userId: userId,
        islandId: island.id,
        point: 0,
        completionStatus: status,
      },
      { transaction },
    );

    userIslands.push(userIsland);
  }

  // Return all user islands (new and existing)
  return [...existingUserIslands, ...userIslands];
}

/**
 * Initialize user levels with transaction support
 * This function creates UserLevel records for all levels in the specified islands
 */
async function initializeUserLevelsWithTransaction(
  userId: string,
  userIslands: UserIsland[],
  transaction: Transaction,
): Promise<UserLevel[]> {
  // Get all island IDs
  const islandIds = userIslands.map((userIsland) => userIsland.islandId);

  // Find all levels for these islands, ordered by position to ensure we process them in order
  const levels = await Level.findAll({
    where: {
      islandId: islandIds,
    },
    order: [['position', 'ASC']],
    transaction,
  });

  if (!levels || levels.length === 0) {
    console.warn('No levels found for the islands');
    return [];
  }

  // Get map of island completion status
  const islandStatusMap = new Map(
    userIslands.map((userIsland) => [userIsland.islandId, userIsland.completionStatus]),
  );

  // Check if user levels already exist
  const existingUserLevels = await UserLevel.findAll({
    where: {
      userId: userId,
      levelId: levels.map((level) => level.id),
    },
    transaction,
  });

  // Skip creation for levels that already have user levels
  const existingLevelIds = new Set(existingUserLevels.map((ul) => ul.levelId));
  const levelsToCreate = levels.filter((level) => !existingLevelIds.has(level.id));

  // Group levels by island ID for easy processing
  const levelsByIsland = levelsToCreate.reduce(
    (acc, level) => {
      if (!acc[level.islandId]) {
        acc[level.islandId] = [];
      }
      acc[level.islandId].push(level);
      return acc;
    },
    {} as Record<string, Level[]>,
  );

  const userLevels: UserLevel[] = [];

  // Process each island's levels
  for (const [islandId, islandLevels] of Object.entries(levelsByIsland)) {
    // Sort levels by position just to be safe
    islandLevels.sort((a, b) => a.position - b.position);

    // Get the island's completion status
    const islandStatus = islandStatusMap.get(islandId);

    // NORMAL LOGIC: First level is InProgress if island is InProgress, others are Locked
    for (let i = 0; i < islandLevels.length; i++) {
      const level = islandLevels[i];
      let status = CompletionStatus.Locked; // Default to locked

      // If the island is in progress and this is the first level (position 0), set it to in progress
      if (islandStatus === CompletionStatus.InProgress && i === 0) {
        status = CompletionStatus.InProgress;
      }

      const userLevel = await UserLevel.create(
        {
          userId: userId,
          levelId: level.id,
          point: 0,
          completionStatus: status,
        },
        { transaction },
      );

      userLevels.push(userLevel);
    }

    // // TEST SCENARIO: First 2 levels Completed, 3rd level InProgress, others Locked
    // for (let i = 0; i < islandLevels.length; i++) {
    //   const level = islandLevels[i];
    //   let status = CompletionStatus.Locked; // Default to locked
    //   let points = 0;

    //   if (i < 2) {
    //     // First 2 levels are completed
    //     status = CompletionStatus.Completed;
    //     points = 100; // Example points for completed levels
    //   } else if (i === 2) {
    //     // 3rd level is in progress
    //     status = CompletionStatus.InProgress;
    //   }

    //   const userLevel = await UserLevel.create(
    //     {
    //       userId: userId,
    //       levelId: level.id,
    //       point: points,
    //       completionStatus: status,
    //     },
    //     { transaction },
    //   );

    //   userLevels.push(userLevel);
    // }
  }

  // Return all user levels (new and existing)
  return [...existingUserLevels, ...userLevels];
}

/**
 * Get a user's enrollment in a course
 * @param courseId - The ID of the course
 * @param userId - The ID of the user
 * @returns The UserCourse record if found, null otherwise
 */
export async function getUserCourseEnrollment(
  courseId: string,
  userId: string,
): Promise<UserCourse | null> {
  return await UserCourse.findOne({
    where: {
      userId: userId,
      courseId: courseId,
    },
  });
}

/**
 * Check if a user is enrolled in a course
 * @param courseId - The ID of the course
 * @param userId - The ID of the user
 * @returns True if enrolled, false otherwise
 */
export async function isUserEnrolledInCourse(courseId: string, userId: string): Promise<boolean> {
  const enrollment = await getUserCourseEnrollment(courseId, userId);
  return !!enrollment;
}
