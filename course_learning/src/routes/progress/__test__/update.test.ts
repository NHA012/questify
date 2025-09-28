import request from 'supertest';
import { app } from '../../../app';
import {
  BadRequestError,
  NotAuthorizedError,
  ResourcePrefix,
  UserRole,
  CompletionStatus,
} from '@datn242/questify-common';
import { User } from '../../../models/user';
import { Course } from '../../../models/course';
import { Island } from '../../../models/island';
import { UserCourse } from '../../../models/user-course';
import { v4 as uuidv4 } from 'uuid';
import { UserIsland } from '../../../models/user-island';
import { UserLevel } from '../../../models/user-level';
import { Level } from '../../../models/level';

const resource = ResourcePrefix.CourseLearning + '/progress/students';

it('returns a 401 if the user is not authorized', async () => {
  const studentId = uuidv4();
  const courseId = uuidv4();

  await request(app)
    .patch(resource + '/' + studentId + '/courses/' + courseId)
    .expect(NotAuthorizedError.statusCode);
});

it('returns a 400 if the provided student id does not exist', async () => {
  const courseId = uuidv4();
  const islandId = uuidv4();
  const levelId = uuidv4();
  const studentId = uuidv4();
  const cookie = await global.getAuthCookie();

  await request(app)
    .patch(resource + '/' + studentId + '/courses/' + courseId)
    .set('Cookie', cookie)
    .send({})
    .expect(BadRequestError.statusCode);

  await request(app)
    .patch(resource + '/' + studentId + '/islands/' + islandId)
    .set('Cookie', cookie)
    .send({})
    .expect(BadRequestError.statusCode);

  await request(app)
    .patch(resource + '/' + studentId + '/levels/' + levelId)
    .set('Cookie', cookie)
    .send({})
    .expect(BadRequestError.statusCode);
});

describe('Already have course, island, level; signin as student', () => {
  let cookie: string[] = undefined!;
  let course: Course = undefined!;
  let island: Island = undefined!;
  let level: Level = undefined!;
  let student1: User = undefined!;

  beforeEach(async () => {
    const studentMail = 'test@student.com';
    cookie = await global.getAuthCookie(studentMail, UserRole.Student);

    student1 = (await User.findOne({ where: { gmail: studentMail } }))!;

    const teacher = User.build({
      gmail: 'test@teacher.com',
      role: UserRole.Teacher,
      userName: 'test_teacher',
    });
    await teacher.save();

    course = await Course.create({
      name: 'test_course',
      teacherId: teacher.id,
    });

    island = await Island.create({
      name: 'test_island',
      courseId: course.id,
      position: 1,
    });

    level = await Level.create({
      name: 'test_level',
      islandId: island.id,
      position: 1,
    });

    await UserCourse.create({
      userId: student1.id,
      courseId: course.id,
      point: 0,
      completionStatus: CompletionStatus.InProgress,
    });

    await UserIsland.create({
      userId: student1.id,
      islandId: island.id,
      point: 0,
      completionStatus: CompletionStatus.InProgress,
    });
    await UserLevel.create({
      userId: student1.id,
      levelId: level.id,
      point: 0,
      completionStatus: CompletionStatus.InProgress,
    });
  });

  it('returns a 401 if the user does not own the course', async () => {
    const studentMail2 = 'student2@gmail.com';
    const cookie1 = await global.getAuthCookie(studentMail2, UserRole.Student);

    await request(app)
      .patch(resource + '/' + student1.id + '/courses/' + course.id)
      .set('Cookie', cookie1)
      .send({})
      .expect(NotAuthorizedError.statusCode);
  });

  it('updates the course provided valid inputs', async () => {
    await request(app)
      .patch(resource + '/' + student1.id + '/courses/' + course.id)
      .set('Cookie', cookie)
      .send({
        completion_status: CompletionStatus.Completed,
      })
      .expect(200);

    await request(app)
      .patch(resource + '/' + student1.id + '/islands/' + island.id)
      .set('Cookie', cookie)
      .send({
        completion_status: CompletionStatus.Completed,
      })
      .expect(200);

    await request(app)
      .patch(resource + '/' + student1.id + '/levels/' + level.id)
      .set('Cookie', cookie)
      .send({
        completion_status: CompletionStatus.Completed,
      })
      .expect(200);
  });
});
