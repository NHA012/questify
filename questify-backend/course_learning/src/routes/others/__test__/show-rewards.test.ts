import request from 'supertest';
import { app } from '../../../app';
import { User } from '../../../models/user';
import { Reward } from '../../../models/reward';
import { Course } from '../../../models/course';
import {
  RequestValidationError,
  UserRole,
  ResourcePrefix,
  NotFoundError,
} from '@datn242/questify-common';

import { v4 as uuidv4 } from 'uuid';

const resource = ResourcePrefix.CourseLearning + '/students';

it(`return ${RequestValidationError.statusCode} if the param input is invalid`, async () => {
  const cookie = await global.getAuthCookie();

  await request(app)
    .get(resource + '/123/rewards')
    .set('Cookie', cookie)
    .expect(RequestValidationError.statusCode)
    .expect((res) => {
      expect(res.text).toContain('student_id must be a valid UUID');
    });
});

it(`return ${NotFoundError.statusCode} if the user not found`, async () => {
  const cookie = await global.getAuthCookie();
  const fakeUserId = uuidv4();

  await request(app)
    .get(resource + '/' + fakeUserId + '/rewards')
    .set('Cookie', cookie)
    .expect(NotFoundError.statusCode);
});

describe('already have teacher, course', () => {
  let course: Course = undefined!;
  let cookie: string[] = undefined!;

  beforeEach(async () => {
    cookie = await global.getAuthCookie();

    const teacher = User.build({
      gmail: 'teacher@test.com',
      role: UserRole.Teacher,
      userName: 'test_teacher',
    });
    await teacher.save();

    course = Course.build({
      name: 'test_course',
      teacherId: teacher.id,
    });
    await course.save();
  });

  it('returns 200 and empty array if the student has no rewards', async () => {
    const student = User.build({
      gmail: 'student@test.com',
      role: UserRole.Student,
      userName: 'test_student',
    });
    await student.save();

    await request(app)
      .get(resource + '/' + student.id + '/rewards')
      .set('Cookie', cookie)
      .expect(200)
      .expect((res) => {
        expect(res.body).toEqual([]);
      });
  });

  it('returns rewards if the rewards is found', async () => {
    const student = User.build({
      gmail: 'student@test.com',
      role: UserRole.Student,
      userName: 'test_student',
    });
    await student.save();

    const reward1 = Reward.build({
      description: 'test_reward',
      rewardTarget: 'course',
      courseId: course.id,
    });
    await reward1.save();
    await student.addReward(reward1);
    await reward1.addUser(student);

    const reward2 = Reward.build({
      description: 'test_reward_2',
      rewardTarget: 'course',
      courseId: course.id,
    });
    await reward2.save();
    await student.addReward(reward2);
    await reward2.addUser(student);

    await request(app)
      .get(resource + '/' + student.id + '/rewards')
      .set('Cookie', cookie)
      .expect(200)
      .expect((res) => {
        expect(res.body.length).toEqual(2);
        expect(res.body[0].description).toEqual('test_reward');
        expect(res.body[0].rewardTarget).toEqual('course');
        expect(res.body[0].courseId).toEqual(course.id);
        expect(res.body[1].description).toEqual('test_reward_2');
        expect(res.body[1].rewardTarget).toEqual('course');
        expect(res.body[1].courseId).toEqual(course.id);
      });
  });
});
