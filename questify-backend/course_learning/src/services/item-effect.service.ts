import { EffectType, BadRequestError } from '@datn242/questify-common';
import { UserCourse } from '../models/user-course';

export function randomGoldItem(): number {
  return Math.floor(Math.random() * 190) + 10;
}

export function randomExpItem(): number {
  return Math.floor(Math.random() * 190) + 10;
}

export async function multipleExpForNextLevel(
  effectType: EffectType,
  courseId: string,
  userId: string,
): Promise<void> {
  const validExpEffects = [EffectType.ExpX2, EffectType.ExpX3, EffectType.ExpX4];

  if (!validExpEffects.includes(effectType)) {
    throw new BadRequestError(
      `Invalid gold effect type: ${effectType}. Must be one of: ${validExpEffects.join(', ')}`,
    );
  }

  const user_course = await UserCourse.findOne({
    where: {
      userId: userId,
      courseId: courseId,
    },
  });
  if (!user_course) {
    throw new BadRequestError('Course not found');
  }
  await user_course.update({
    nextLevelEffect: effectType,
  });
  await user_course.save();
  return;
}

export async function multipleGoldForNextLevel(
  effectType: EffectType,
  courseId: string,
  userId: string,
): Promise<void> {
  const validGoldEffects = [EffectType.GoldX2, EffectType.GoldX3, EffectType.GoldX4];

  if (!validGoldEffects.includes(effectType)) {
    throw new BadRequestError(
      `Invalid gold effect type: ${effectType}. Must be one of: ${validGoldEffects.join(', ')}`,
    );
  }

  const user_course = await UserCourse.findOne({
    where: {
      userId: userId,
      courseId: courseId,
    },
  });
  if (!user_course) {
    throw new BadRequestError('Course not found');
  }
  await user_course.update({
    nextLevelEffect: effectType,
  });
  await user_course.save();
  return;
}
