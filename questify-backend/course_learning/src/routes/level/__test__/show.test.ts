import request from 'supertest';
import { app } from '../../../app';
import { Course } from '../../../models/course';
import { Level } from '../../../models/level';
import { Island } from '../../../models/island';
import { User } from '../../../models/user';
import {
  RequestValidationError,
  NotFoundError,
  UserRole,
  ResourcePrefix,
} from '@datn242/questify-common';

import { v4 as uuidv4 } from 'uuid';

const resource = ResourcePrefix.CourseLearning + '/levels';

it(`return ${RequestValidationError.statusCode} if the query input is invalid`, async () => {
  const cookie = await global.getAuthCookie();

  await request(app)
    .get(resource + '/123')
    .set('Cookie', cookie)
    .expect(RequestValidationError.statusCode)
    .expect((res) => {
      expect(res.text).toContain('level_id must be a valid UUID');
    });
});

it(`return ${NotFoundError.statusCode} if the level not found`, async () => {
  const cookie = await global.getAuthCookie();
  const fakeLevelId = uuidv4();

  await request(app)
    .get(resource + `/${fakeLevelId}`)
    .set('Cookie', cookie)
    .expect(NotFoundError.statusCode);
});

it('returns a level if the level is found', async () => {
  const teacherGmail = 'test@teacher.com';
  const cookie = await global.getAuthCookie(teacherGmail, UserRole.Teacher);

  const teacher = await User.findOne({
    where: {
      gmail: teacherGmail,
    },
  });

  const course = Course.build({
    name: 'test_course',
    teacherId: teacher!.id,
  });
  await course.save();

  const island = Island.build({
    name: 'test_island',
    position: 1,
    courseId: course.id,
  });
  await island.save();

  const levelName = 'test_level';
  const levelPosition = 1;

  const level = Level.build({
    name: levelName,
    position: levelPosition,
    islandId: island.id,
  });
  await level.save();

  await request(app)
    .get(resource + `/${level.id}`)
    .set('Cookie', cookie)
    .expect(200)
    .expect((res) => {
      expect(res.body.name).toEqual(levelName);
      expect(res.body.position).toEqual(levelPosition);
      expect(res.body.islandId).toEqual(island.id);
    });
});
