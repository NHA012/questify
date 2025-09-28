import { CompletionStatus } from '@datn242/questify-common';
import { UserIsland } from '../models/user-island';
import { UserCourse } from '../models/user-course';
import { Level } from '../models/level';
import { UserLevel } from '../models/user-level';
import { Island } from '../models/island';
import { PrerequisiteIsland } from '../models/prerequisite-island';

// Helper function to update island points when level points change
export async function updateIslandPoints(
  userId: string,
  islandId: string,
  pointDifference: number,
): Promise<void> {
  try {
    const userIsland = await UserIsland.findOne({
      where: {
        userId,
        islandId,
      },
    });

    if (!userIsland) {
      return;
    }

    // Update the island points
    const newPoint = userIsland.point + pointDifference;
    await userIsland.update({ point: newPoint });

    // Get course ID to propagate the change
    const island = await Island.findByPk(islandId);
    if (island) {
      await updateCoursePoints(userId, island.courseId, pointDifference);
    }
  } catch (error) {
    console.error('Error updating island points:', error);
  }
}

// Helper function to update course points when island points change
export async function updateCoursePoints(
  userId: string,
  courseId: string,
  pointDifference: number,
): Promise<void> {
  try {
    const userCourse = await UserCourse.findOne({
      where: {
        userId,
        courseId,
      },
    });

    if (!userCourse) {
      return;
    }

    // Update the course points
    const newPoint = userCourse.point + pointDifference;
    await userCourse.update({ point: newPoint });
  } catch (error) {
    console.error('Error updating course points:', error);
  }
}

// Helper function to unlock the next level after a level is completed
export async function unlockNextLevel(
  userId: string,
  islandId: string,
  currentPosition: number,
): Promise<void> {
  try {
    // Find the next level in the island based on position
    const nextLevel = await Level.findOne({
      where: {
        islandId,
        position: currentPosition + 1, // Next position
      },
    });

    if (!nextLevel) {
      return;
    }

    // Find the user level for this next level
    const userNextLevel = await UserLevel.findOne({
      where: {
        userId,
        levelId: nextLevel.id,
      },
    });

    if (!userNextLevel) {
      return;
    }

    // Only update if it's locked
    if (userNextLevel.completionStatus === CompletionStatus.Locked) {
      await userNextLevel.update({
        completionStatus: CompletionStatus.InProgress,
      });
    }
  } catch (error) {
    console.error('Error unlocking next level:', error);
  }
}

// Helper function to check if all levels in an island are completed and update island status
export async function checkAndUpdateIslandStatus(userId: string, islandId: string): Promise<void> {
  try {
    // Get all levels for this island
    const levels = await Level.findAll({
      where: {
        islandId,
      },
      order: [['position', 'ASC']],
    });

    if (levels.length === 0) {
      return; // No levels to check
    }

    // Get user level statuses
    const levelIds = levels.map((level) => level.id);
    const userLevels = await UserLevel.findAll({
      where: {
        userId,
        levelId: levelIds,
      },
    });

    // Check if all levels are completed
    const allCompleted =
      userLevels.length === levels.length &&
      userLevels.every((userLevel) => userLevel.completionStatus === CompletionStatus.Completed);

    if (allCompleted) {
      // Update island status to Completed
      const userIsland = await UserIsland.findOne({
        where: {
          userId,
          islandId,
        },
      });

      if (userIsland && userIsland.completionStatus !== CompletionStatus.Completed) {
        const now = new Date();
        await userIsland.update({
          completionStatus: CompletionStatus.Completed,
          finishedDate: now,
        });

        // Get the island's course
        const island = await Island.findByPk(islandId);
        if (island) {
          // Unlock dependent islands
          await unlockDependentIslands(userId, islandId, island.courseId);

          // Check course status
          await checkAndUpdateCourseStatus(userId, island.courseId);
        }
      }
    }
  } catch (error) {
    console.error('Error checking and updating island status:', error);
  }
}

// Helper function to unlock islands that depend on this completed island
export async function unlockDependentIslands(
  userId: string,
  completedIslandId: string,
  courseId: string,
): Promise<void> {
  try {
    // Find all islands that have this island as a prerequisite
    const prerequisiteRecords = await PrerequisiteIsland.findAll({
      where: {
        prerequisiteIslandId: completedIslandId,
      },
    });

    // If no direct prerequisites found, check all locked islands in the course
    if (prerequisiteRecords.length === 0) {
      // Get all islands for this course
      const islands = await Island.findAll({
        where: {
          courseId,
        },
      });

      // For each island in the course
      for (const island of islands) {
        // Skip the completed island
        if (island.id === completedIslandId) {
          continue;
        }

        // Check if this island is currently locked
        const userIsland = await UserIsland.findOne({
          where: {
            userId,
            islandId: island.id,
          },
        });

        if (userIsland && userIsland.completionStatus === CompletionStatus.Locked) {
          // Check if this island should be unlocked now
          const shouldUnlock = await checkIslandPrerequisites(userId, island.id, completedIslandId);

          if (shouldUnlock) {
            // Update the island to in-progress
            await userIsland.update({ completionStatus: CompletionStatus.InProgress });

            // Also unlock the first level of this island
            await unlockFirstLevel(userId, island.id);
          }
        }
      }

      return;
    }

    // For each dependent island from direct prerequisite records
    for (const prerequisite of prerequisiteRecords) {
      const dependentIslandId = prerequisite.islandId;

      // Check if all prerequisites for this dependent island are completed
      const allPrerequisitesCompleted = await areAllPrerequisitesCompleted(
        userId,
        dependentIslandId,
      );

      if (allPrerequisitesCompleted) {
        // Update the dependent island to in-progress
        const userIsland = await UserIsland.findOne({
          where: {
            userId,
            islandId: dependentIslandId,
          },
        });

        if (userIsland && userIsland.completionStatus === CompletionStatus.Locked) {
          await userIsland.update({ completionStatus: CompletionStatus.InProgress });

          // Also unlock the first level of this island
          await unlockFirstLevel(userId, dependentIslandId);
        }
      }
    }
  } catch (error) {
    console.error('Error unlocking dependent islands:', error);
  }
}

// Helper function to check if an island should be unlocked based on the recently completed island
async function checkIslandPrerequisites(
  userId: string,
  islandId: string,
  completedIslandId: string,
): Promise<boolean> {
  try {
    // Get island position in the course
    const completedIsland = await Island.findByPk(completedIslandId);
    const currentIsland = await Island.findByPk(islandId);

    if (!completedIsland || !currentIsland) {
      return false;
    }

    // If they're not in the same course, they don't have a dependency
    if (completedIsland.courseId !== currentIsland.courseId) {
      return false;
    }

    // Check if this is a dependency based on position
    // Islands typically follow a sequence in courses
    if (completedIsland.position < currentIsland.position) {
      // Check if there are any incomplete islands between them
      const intermediateIslands = await Island.findAll({
        where: {
          courseId: completedIsland.courseId,
          position: {
            [Symbol.for('gt')]: completedIsland.position,
            [Symbol.for('lt')]: currentIsland.position,
          },
        },
      });

      // If no islands between them or all intermediate islands are completed, unlock this one
      if (intermediateIslands.length === 0) {
        return true;
      }

      // Check if all intermediate islands are completed
      for (const island of intermediateIslands) {
        const userIsland = await UserIsland.findOne({
          where: {
            userId,
            islandId: island.id,
          },
        });

        if (!userIsland || userIsland.completionStatus !== CompletionStatus.Completed) {
          return false; // There's at least one uncompleted island in between
        }
      }

      return true; // All intermediate islands are completed
    }

    return false;
  } catch (error) {
    console.error('Error checking island prerequisites:', error);
    return false;
  }
}

// Helper function to check if all prerequisites for an island are completed
export async function areAllPrerequisitesCompleted(
  userId: string,
  islandId: string,
): Promise<boolean> {
  try {
    // Get all prerequisite island IDs for this island
    const prerequisites = await PrerequisiteIsland.findAll({
      where: {
        islandId,
      },
    });

    if (prerequisites.length === 0) {
      return true; // No prerequisites, so all are "completed"
    }

    const prerequisiteIslandIds = prerequisites.map((p) => p.prerequisiteIslandId);

    // Get user island status for all prerequisites
    const userPrerequisiteIslands = await UserIsland.findAll({
      where: {
        userId,
        islandId: prerequisiteIslandIds,
      },
    });

    // Check if all prerequisites are completed
    const allCompleted =
      userPrerequisiteIslands.length === prerequisiteIslandIds.length &&
      userPrerequisiteIslands.every((ui) => ui.completionStatus === CompletionStatus.Completed);

    return allCompleted;
  } catch (error) {
    console.error('Error checking prerequisites completion:', error);
    return false;
  }
}

// Helper function to unlock the first level of an island
export async function unlockFirstLevel(userId: string, islandId: string): Promise<void> {
  try {
    // Find the first level in the island
    const firstLevel = await Level.findOne({
      where: {
        islandId,
      },
      order: [['position', 'ASC']],
    });

    if (!firstLevel) {
      return;
    }

    // Update user level for the first level
    const userLevel = await UserLevel.findOne({
      where: {
        userId,
        levelId: firstLevel.id,
      },
    });

    if (!userLevel) {
      return;
    }

    if (userLevel.completionStatus === CompletionStatus.Locked) {
      await userLevel.update({ completionStatus: CompletionStatus.InProgress });
    }
  } catch (error) {
    console.error('Error unlocking first level:', error);
  }
}

// Helper function to check if all islands in a course are completed
export async function checkAndUpdateCourseStatus(userId: string, courseId: string): Promise<void> {
  try {
    // Get all islands for this course
    const islands = await Island.findAll({
      where: {
        courseId,
      },
    });

    if (islands.length === 0) {
      return; // No islands to check
    }

    // Get user island statuses
    const islandIds = islands.map((island) => island.id);
    const userIslands = await UserIsland.findAll({
      where: {
        userId,
        islandId: islandIds,
      },
    });

    // Check if all islands are completed
    const allCompleted =
      userIslands.length === islands.length &&
      userIslands.every((userIsland) => userIsland.completionStatus === CompletionStatus.Completed);

    if (allCompleted) {
      // Update course status to Completed
      const userCourse = await UserCourse.findOne({
        where: {
          userId,
          courseId,
        },
      });

      if (userCourse && userCourse.completionStatus !== CompletionStatus.Completed) {
        const now = new Date();
        await userCourse.update({
          completionStatus: CompletionStatus.Completed,
          finishedDate: now,
        });
      }
    }
  } catch (error) {
    console.error('Error checking and updating course status:', error);
  }
}
