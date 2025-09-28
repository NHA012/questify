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
import { Level } from '../../../models/level';
import { UserLevel } from '../../../models/user-level';
import { v4 as uuidv4 } from 'uuid';

const resource = ResourcePrefix.CourseLearning + '/roadmap/islands';

it(`has a route handler listening to ${resource + '/:island_id'} for post requests`, async () => {
  const islandId = uuidv4();
  const response = await request(app)
    .post(resource + '/' + islandId)
    .send({});

  expect(response.status).not.toEqual(NotFoundError.statusCode);
});

it('can only be accessed if the user is signed in', async () => {
  const islandId = uuidv4();
  await request(app)
    .post(resource + '/' + islandId)
    .send({})
    .expect(NotAuthorizedError.statusCode);
});

it('can only create feedback if the user is signed in as student', async () => {
  const cookie = await global.getAuthCookie(undefined, UserRole.Student);
  const islandId = uuidv4();
  const response = await request(app)
    .post(resource + '/' + islandId)
    .set('Cookie', cookie)
    .send({});

  expect(response.status).not.toEqual(NotAuthorizedError.statusCode);
});

it(`returns a status other than ${NotAuthorizedError.statusCode} if the user is signed in`, async () => {
  const cookie = await global.getAuthCookie();
  const islandId = uuidv4();
  const response = await request(app)
    .post(resource + '/' + islandId)
    .set('Cookie', cookie)
    .send({});

  expect(response.status).not.toEqual(NotAuthorizedError.statusCode);
});

describe('Already have course, island, and level; signin as student', () => {
  let cookie: string[] = undefined!;
  let island: Island = undefined!;

  beforeEach(async () => {
    const studentMail = 'test@student.com';
    cookie = await global.getAuthCookie(studentMail, UserRole.Student);

    const teacher = User.build({
      gmail: 'test@teacher.com',
      role: UserRole.Teacher,
      userName: 'test_teacher',
    });
    await teacher.save();

    const course = Course.build({
      name: 'test_course',
      teacherId: teacher!.id,
    });
    await course.save();

    island = await Island.create({
      name: 'test_island_1',
      position: 1,
      courseId: course.id,
    });

    await Level.create({
      name: 'test_level_1',
      position: 1,
      islandId: island.id,
    });

    await Level.create({
      name: 'test_level_2',
      position: 2,
      islandId: island.id,
    });

    await Level.create({
      name: 'test_level_3',
      position: 3,
      islandId: island.id,
    });
  });

  it('creates UserLevels with valid inputs', async () => {
    let UserLevels = await UserLevel.findAll();
    expect(UserLevels.length).toEqual(0);

    const student = (await User.findOne({
      where: { gmail: 'test@student.com' },
    }))!;

    await request(app)
      .post(resource + '/' + island.id)
      .set('Cookie', cookie)
      .send({})
      .expect(201);

    UserLevels = await UserLevel.findAll({
      include: [
        {
          model: Level,
        },
      ],
    });
    expect(UserLevels.length).toEqual(3);
    for (let i: number = 0; i <= 2; i++) {
      expect(UserLevels[i].userId).toEqual(student.id);
    }
  });
});
