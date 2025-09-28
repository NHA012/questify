import { BadRequestError } from '@datn242/questify-common';
import { User } from '../models/user';
import { UserIsland } from '../models/user-island';
import { Island } from '../models/island';
import { Course } from '../models/course';
import { CompletionStatus } from '@datn242/questify-common';

export async function initializeUserIslands(
  courseId: string,
  userId: string,
): Promise<UserIsland[]> {
  const course = await Course.findByPk(courseId);
  if (!course) {
    throw new BadRequestError('Course not found');
  }

  const student = await User.findByPk(userId);
  if (!student) {
    throw new BadRequestError('Current student not found');
  }
  if (student.role !== 'student') {
    throw new BadRequestError('Only student can init user island');
  }

  const islands = await Island.findAll({
    where: {
      courseId: course.id,
    },
  });

  if (!islands || islands.length === 0) {
    throw new BadRequestError('Islands not found');
  }

  const userIslands: UserIsland[] = [];
  for (const island of islands) {
    const status = island.position === 0 ? CompletionStatus.InProgress : CompletionStatus.Locked;

    const userIsland = await UserIsland.create({
      userId: student.id,
      islandId: island.id,
      point: 0,
      completionStatus: status,
    });

    userIslands.push(userIsland);
  }

  return userIslands;
}
