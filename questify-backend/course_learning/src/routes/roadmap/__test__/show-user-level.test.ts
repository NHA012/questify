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
import { v4 as uuidv4 } from 'uuid';

const resource = ResourcePrefix.CourseLearning + '/roadmap/islands';

it('only allow if signin', async () => {
  const islandId = uuidv4();

  await request(app)
    .get(resource + '/' + islandId)
    .send()
    .expect(NotAuthorizedError.statusCode);
});

it('returns a 404 if the course is not found', async () => {
  const islandId = uuidv4();
  const cookie = await global.getAuthCookie();

  await request(app)
    .get(resource + '/' + islandId)
    .set('Cookie', cookie)
    .send()
    .expect(NotFoundError.statusCode);
});

describe('Already have course, island; signin as student', () => {
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
  });

  it('Return empty if there is no level', async () => {
    await request(app)
      .post(resource + '/' + island.id)
      .set('Cookie', cookie)
      .send({})
      .expect(201);

    const response = await request(app)
      .get(resource + '/' + island.id)
      .set('Cookie', cookie)
      .send({})
      .expect(200);
    expect(response.body.userLevels).toEqual([]);
  });

  it('Return user-level if there is levels in db', async () => {
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

    await request(app)
      .post(resource + '/' + island.id)
      .set('Cookie', cookie)
      .send({})
      .expect(201);

    const response = await request(app)
      .get(resource + '/' + island.id)
      .set('Cookie', cookie)
      .send({})
      .expect(200);
    expect(response.body.userLevels.length).toEqual(3);
    const listOfName = response.body.userLevels.map(
      (userLevel: { Level: { name: string } }) => userLevel.Level.name,
    );
    expect(listOfName).toEqual(
      expect.arrayContaining(['test_level_1', 'test_level_2', 'test_level_3']),
    );
    const listOfPosition = response.body.userLevels.map(
      (userLevel: { Level: { position: number } }) => userLevel.Level.position,
    );
    expect(listOfPosition).toEqual(expect.arrayContaining([1, 2, 3]));
  });
});
