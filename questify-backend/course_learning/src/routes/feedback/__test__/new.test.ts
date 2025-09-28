import request from 'supertest';
import { app } from '../../../app';
import { Feedback } from '../../../models/feedback';
import {
  NotAuthorizedError,
  RequestValidationError,
  NotFoundError,
  ResourcePrefix,
  UserRole,
} from '@datn242/questify-common';
import { User } from '../../../models/user';
import { Course } from '../../../models/course';
import { Island } from '../../../models/island';
import { Level } from '../../../models/level';
import { Attempt } from '../../../models/attempt';

const resource = ResourcePrefix.CourseLearning + '/feedback';

it(`has a route handler listening to ${resource} for post requests`, async () => {
  const response = await request(app).post(resource).send({});

  expect(response.status).not.toEqual(NotFoundError.statusCode);
});

it('can only be accessed if the user is signed in', async () => {
  await request(app).post(resource).send({}).expect(NotAuthorizedError.statusCode);
});

it('can only create feedback if the user is signed in as student', async () => {
  const cookie = await global.getAuthCookie(undefined, UserRole.Student);
  const response = await request(app).post(resource).set('Cookie', cookie).send({});

  expect(response.status).not.toEqual(NotAuthorizedError.statusCode);
});

it(`returns a status other than ${NotAuthorizedError.statusCode} if the user is signed in`, async () => {
  const cookie = await global.getAuthCookie();
  const response = await request(app).post(resource).set('Cookie', cookie).send({});

  expect(response.status).not.toEqual(NotAuthorizedError.statusCode);
});

describe('Already have course, island, and level', () => {
  let level: Level = undefined!;
  let cookie: string[] = undefined!;

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
  });

  it('returns an error if an invalid attempt_id or message is provided', async () => {
    const Feedbacks = await Feedback.findAll();
    expect(Feedbacks.length).toEqual(0);

    const student = User.build({
      gmail: 'test@student.com',
      role: UserRole.Student,
      userName: 'test_student',
    });
    await student.save();

    const attempt = Attempt.build({
      userId: student.id,
      levelId: level.id,
    });
    await attempt.save();

    await request(app)
      .post(resource)
      .set('Cookie', cookie)
      .send({
        message: 'test_message',
        attempt_id: 12,
      })
      .expect(RequestValidationError.statusCode);

    await request(app)
      .post(resource)
      .set('Cookie', cookie)
      .send({
        message: 'test_message',
      })
      .expect(RequestValidationError.statusCode);

    await request(app)
      .post(resource)
      .set('Cookie', cookie)
      .send({
        attempt_id: attempt.id,
      })
      .expect(RequestValidationError.statusCode);

    await request(app)
      .post(resource)
      .set('Cookie', cookie)
      .send({
        message: 123,
        attempt_id: attempt.id,
      })
      .expect(RequestValidationError.statusCode);
  });

  it('creates a Feedback with valid inputs', async () => {
    let Feedbacks = await Feedback.findAll();
    expect(Feedbacks.length).toEqual(0);

    const student = User.build({
      gmail: 'test@student.com',
      role: UserRole.Student,
      userName: 'test_student',
    });
    await student.save();

    const attempt = Attempt.build({
      userId: student.id,
      levelId: level.id,
    });
    await attempt.save();

    await request(app)
      .post(resource)
      .set('Cookie', cookie)
      .send({
        message: 'test_message',
        attempt_id: attempt.id,
      })
      .expect(201);

    Feedbacks = await Feedback.findAll();
    expect(Feedbacks.length).toEqual(1);
    expect(Feedbacks[0].message).toEqual('test_message');
  });
});
