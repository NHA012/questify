import request from 'supertest';
import { app } from '../../../app';
import {
  NotAuthorizedError,
  NotFoundError,
  ResourcePrefix,
  UserRole,
} from '@datn242/questify-common';
import { User } from '../../../models/user';
import { Course } from '../../../models/course';
import { Island } from '../../../models/island';
import { UserIsland } from '../../../models/user-island';
import { v4 as uuidv4 } from 'uuid';

const resource = ResourcePrefix.CourseLearning + '/roadmap/courses';

it(`has a route handler listening to ${resource + '/course_id'} for post requests`, async () => {
  const courseId = uuidv4();
  const response = await request(app)
    .post(resource + '/' + courseId)
    .send({});

  expect(response.status).not.toEqual(NotFoundError.statusCode);
});

it('can only be accessed if the user is signed in', async () => {
  const courseId = uuidv4();
  await request(app)
    .post(resource + '/' + courseId)
    .send({})
    .expect(NotAuthorizedError.statusCode);
});

it('can only create feedback if the user is signed in as student', async () => {
  const cookie = await global.getAuthCookie(undefined, UserRole.Student);
  const courseId = uuidv4();
  const response = await request(app)
    .post(resource + '/' + courseId)
    .set('Cookie', cookie)
    .send({});

  expect(response.status).not.toEqual(NotAuthorizedError.statusCode);
});

it(`returns a status other than ${NotAuthorizedError.statusCode} if the user is signed in`, async () => {
  const cookie = await global.getAuthCookie();
  const courseId = uuidv4();
  const response = await request(app)
    .post(resource + '/' + courseId)
    .set('Cookie', cookie)
    .send({});

  expect(response.status).not.toEqual(NotAuthorizedError.statusCode);
});

describe('Already have course, island; signin as student', () => {
  let cookie: string[] = undefined!;
  let course: Course = undefined!;

  beforeEach(async () => {
    const studentMail = 'test@student.com';
    cookie = await global.getAuthCookie(studentMail, UserRole.Student);

    const teacher = User.build({
      gmail: 'test@teacher.com',
      role: UserRole.Teacher,
      userName: 'test_teacher',
    });
    await teacher.save();

    course = Course.build({
      name: 'test_course',
      teacherId: teacher!.id,
    });
    await course.save();

    await Island.create({
      name: 'test_island_1',
      position: 1,
      courseId: course.id,
    });

    await Island.create({
      name: 'test_island_2',
      position: 2,
      courseId: course.id,
    });

    await Island.create({
      name: 'test_island_3',
      position: 3,
      courseId: course.id,
    });
  });

  it('creates a UserIslands with valid inputs', async () => {
    let UserIslands = await UserIsland.findAll();
    expect(UserIslands.length).toEqual(0);

    const student = (await User.findOne({
      where: { gmail: 'test@student.com' },
    }))!;

    await request(app)
      .post(resource + '/' + course.id)
      .set('Cookie', cookie)
      .send({})
      .expect(201);

    UserIslands = await UserIsland.findAll({
      include: [
        {
          model: Island,
        },
      ],
    });
    expect(UserIslands.length).toEqual(3);
    for (let i: number = 0; i <= 2; i++) {
      expect(UserIslands[i].userId).toEqual(student.id);
    }
  });
});
