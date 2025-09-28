import request from 'supertest';
import { app } from '../../../app';
import { Course } from '../../../models/course';
import { Level } from '../../../models/level';
import { Island } from '../../../models/island';
import { User } from '../../../models/user';
import { Hint } from '../../../models/hint';
import {
  RequestValidationError,
  UserRole,
  ResourcePrefix,
  BadRequestError,
} from '@datn242/questify-common';

import { v4 as uuidv4 } from 'uuid';

const resource = ResourcePrefix.CourseLearning + '/hints';

it(`return ${RequestValidationError.statusCode} if the query input is invalid`, async () => {
  const cookie = await global.getAuthCookie();

  await request(app)
    .get(resource)
    .set('Cookie', cookie)
    .query({
      'level-id': 1,
    })
    .expect(RequestValidationError.statusCode)
    .expect((res) => {
      expect(res.text).toContain('level-id must be a valid UUID');
    });
  await request(app)
    .get(resource)
    .set('Cookie', cookie)
    .query({})
    .expect(RequestValidationError.statusCode)
    .expect((res) => {
      expect(res.text).toContain('level-id is required');
    });
});

it(`return ${BadRequestError.statusCode} if the level not found`, async () => {
  const cookie = await global.getAuthCookie();
  const fakeLevelId = uuidv4();

  await request(app)
    .get(resource)
    .set('Cookie', cookie)
    .query({
      'level-id': fakeLevelId,
    })
    .expect(BadRequestError.statusCode)
    .expect((res) => {
      expect(res.text).toContain('Level not found');
    });
});

it('returns a hint if the hint is found', async () => {
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

  const hint = Hint.build({
    description: 'test_hint_description_1',
    price: 100,
    levelId: level.id,
  });
  await hint.save();

  const hint2 = Hint.build({
    description: 'test_hint_description_2',
    price: 200,
    levelId: level.id,
  });
  await hint2.save();

  await request(app)
    .get(resource)
    .set('Cookie', cookie)
    .query({
      'level-id': level.id,
    })
    .expect(200)
    .expect((res) => {
      expect(res.body.length).toEqual(2);
      expect(res.body[0].description).toEqual('test_hint_description_1');
      expect(res.body[0].price).toEqual(100);
      expect(res.body[1].description).toEqual('test_hint_description_2');
      expect(res.body[1].price).toEqual(200);
    });
});
