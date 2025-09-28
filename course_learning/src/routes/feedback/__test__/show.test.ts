import request from 'supertest';
import { app } from '../../../app';
import { Course } from '../../../models/course';
import { Level } from '../../../models/level';
import { Island } from '../../../models/island';
import { User } from '../../../models/user';
import { Attempt } from '../../../models/attempt';
import {
  RequestValidationError,
  UserRole,
  ResourcePrefix,
  BadRequestError,
} from '@datn242/questify-common';

import { v4 as uuidv4 } from 'uuid';

const resource = ResourcePrefix.CourseLearning + '/feedback';

it(`return ${RequestValidationError.statusCode} if the query input is invalid`, async () => {
  const cookie = await global.getAuthCookie();
  const fakeStudentId = uuidv4();
  const fakeLevelId = uuidv4();

  await request(app)
    .get(resource)
    .set('Cookie', cookie)
    .query({
      'level-id': fakeLevelId,
    })
    .expect(RequestValidationError.statusCode)
    .expect((res) => {
      expect(res.text).toContain('student-id is required');
    });

  await request(app)
    .get(resource)
    .set('Cookie', cookie)
    .query({
      'student-id': 1,
      'level-id': fakeLevelId,
    })
    .expect(RequestValidationError.statusCode)
    .expect((res) => {
      expect(res.text).toContain('student-id must be a valid UUID');
    });

  await request(app)
    .get(resource)
    .set('Cookie', cookie)
    .query({
      'student-id': fakeStudentId,
    })
    .expect(RequestValidationError.statusCode)
    .expect((res) => {
      expect(res.text).toContain('level-id is required');
    });
  await request(app)
    .get(resource)
    .set('Cookie', cookie)
    .query({
      'student-id': fakeStudentId,
      'level-id': 2,
    })
    .expect(RequestValidationError.statusCode)
    .expect((res) => {
      expect(res.text).toContain('level-id must be a valid UUID');
    });
});

describe('Already have course, island, level, student and attempt', () => {
  let level: Level = undefined!;
  let cookie: string[] = undefined!;
  let student: User = undefined!;
  let attempt: Attempt = undefined!;

  beforeEach(async () => {
    const teacherGmail = 'test@teacher.com';
    cookie = await global.getAuthCookie(teacherGmail, UserRole.Teacher);

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

    level = Level.build({
      name: 'test_level',
      position: 1,
      islandId: island.id,
    });
    await level.save();

    student = User.build({
      gmail: 'test@student.com',
      role: UserRole.Student,
      userName: 'test_student',
    });
    await student.save();

    attempt = Attempt.build({
      userId: student.id,
      levelId: level.id,
    });
    await attempt.save();
  });

  it('returns a BadRequestError if the student or level is not found', async () => {
    const fakeStudentId = uuidv4();
    const fakeLevelId = uuidv4();

    await request(app)
      .post(resource)
      .set('Cookie', cookie)
      .send({
        message: 'test_message',
        attempt_id: attempt.id,
      })
      .expect(201);

    await request(app)
      .get(resource)
      .set('Cookie', cookie)
      .query({
        'student-id': fakeStudentId,
        'level-id': level.id,
      })
      .expect(BadRequestError.statusCode)
      .expect((res) => {
        expect(res.text).toContain('Student not found');
      });

    await request(app)
      .get(resource)
      .set('Cookie', cookie)
      .query({
        'student-id': student.id,
        'level-id': fakeLevelId,
      })
      .expect(BadRequestError.statusCode)
      .expect((res) => {
        expect(res.text).toContain('Level not found');
      });
  });

  it('returns the feedbacks if the feedbacks is found', async () => {
    const testMessage = 'Baby im real';
    const testMessage2 = 'Wildest dreams';

    await request(app)
      .post(resource)
      .set('Cookie', cookie)
      .send({
        message: testMessage,
        attempt_id: attempt.id,
      })
      .expect(201);
    await request(app)
      .post(resource)
      .set('Cookie', cookie)
      .send({
        message: testMessage2,
        attempt_id: attempt.id,
      })
      .expect(201);

    const feedbacksResponse = await request(app)
      .get(resource)
      .set('Cookie', cookie)
      .query({
        'student-id': student.id,
        'level-id': level.id,
      })
      .expect(200);

    expect(feedbacksResponse.body.feedbacks.length).toEqual(2);
    expect(feedbacksResponse.body.feedbacks[0].message).toEqual(testMessage);
    expect(feedbacksResponse.body.feedbacks[1].message).toEqual(testMessage2);
  });
});
