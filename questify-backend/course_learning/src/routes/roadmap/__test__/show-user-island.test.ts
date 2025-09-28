import request from 'supertest';
import { app } from '../../../app';
import {
  BadRequestError,
  NotAuthorizedError,
  NotFoundError,
  ResourcePrefix,
  UserRole,
} from '@datn242/questify-common';
import { User } from '../../../models/user';
import { Course } from '../../../models/course';
import { Island } from '../../../models/island';
import { v4 as uuidv4 } from 'uuid';

const resource = ResourcePrefix.CourseLearning + '/roadmap/courses';

it('only allow if signin', async () => {
  const courseId = uuidv4();

  await request(app)
    .get(resource + '/' + courseId)
    .send()
    .expect(NotAuthorizedError.statusCode);
});

it('returns a 404 if the course is not found', async () => {
  const courseId = uuidv4();
  const cookie = await global.getAuthCookie();

  await request(app)
    .get(resource + '/' + courseId)
    .set('Cookie', cookie)
    .send()
    .expect(NotFoundError.statusCode);
});

describe('Already have course; signin as student', () => {
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
  });

  it('Return empty if there is no island', async () => {
    await request(app)
      .post(resource + '/' + course.id)
      .set('Cookie', cookie)
      .send({})
      .expect(BadRequestError.statusCode);
  });

  it('Return user-island if there is islands in db', async () => {
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
    await request(app)
      .post(resource + '/' + course.id)
      .set('Cookie', cookie)
      .send({})
      .expect(201);

    const response = await request(app)
      .get(resource + '/' + course.id)
      .set('Cookie', cookie)
      .send({})
      .expect(200);

    expect(response.body.userIslands.length).toEqual(3);
    const listOfName = response.body.userIslands.map(
      (userIsland: { Island: { name: string } }) => userIsland.Island.name,
    );
    expect(listOfName).toEqual(
      expect.arrayContaining(['test_island_1', 'test_island_2', 'test_island_3']),
    );
    const listOfPosition = response.body.userIslands.map(
      (userIsland: { Island: { position: number } }) => userIsland.Island.position,
    );
    expect(listOfPosition).toEqual(expect.arrayContaining([1, 2, 3]));
  });
});
