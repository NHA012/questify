import request from 'supertest';
import { app } from '../../../app';
import { User } from '../../../models/user';
import { Course } from '../../../models/course';
import {
  RequestValidationError,
  UserRole,
  ResourcePrefix,
  NotFoundError,
  CompletionStatus,
} from '@datn242/questify-common';
import { v4 as uuidv4 } from 'uuid';
import { UserCourse } from '../../../models/user-course';

const resource = ResourcePrefix.CourseLearning + '/courses';

it(`returns ${RequestValidationError.statusCode} if the param input is invalid`, async () => {
  const cookie = await global.getAuthCookie();

  await request(app)
    .get(resource + '/randomCourseId' + '/leaderboard')
    .set('Cookie', cookie)
    .expect(RequestValidationError.statusCode)
    .expect((res) => {
      expect(res.text).toContain('course_id must be a valid UUID');
    });
});

it(`returns ${NotFoundError.statusCode} if the course not found`, async () => {
  const cookie = await global.getAuthCookie();
  const fakeCourseId = uuidv4();

  await request(app)
    .get(resource + '/' + fakeCourseId + '/leaderboard')
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
    const response = await request(app)
      .get(resource + '/' + course.id + '/leaderboard')
      .set('Cookie', cookie)
      .expect(200);

    expect(response.body).toEqual([]);
  });

  it('returns leaderboard if there are students enrolled in the course', async () => {
    const student1 = await User.create({
      gmail: 'student1@test.com',
      role: UserRole.Student,
      userName: 'test_student_1',
    });

    await UserCourse.create({
      userId: student1.id,
      courseId: course.id,
      point: 1,
      completionStatus: CompletionStatus.Completed,
    });

    const student2 = await User.create({
      gmail: 'student2@test.com',
      role: UserRole.Student,
      userName: 'test_student_2',
    });

    await UserCourse.create({
      userId: student2.id,
      courseId: course.id,
      point: 2,
      completionStatus: CompletionStatus.Completed,
    });

    const student3 = await User.create({
      gmail: 'student3@test.com',
      role: UserRole.Student,
      userName: 'test_student_3',
    });

    await UserCourse.create({
      userId: student3.id,
      courseId: course.id,
      point: 3,
      completionStatus: CompletionStatus.Completed,
    });
    const response = await request(app)
      .get(resource + '/' + course.id + '/leaderboard')
      .set('Cookie', cookie)
      .expect(200);

    expect(response.body[0].rank).toEqual(1);
    expect(response.body[1].rank).toEqual(2);
    expect(response.body[2].rank).toEqual(3);
    expect(response.body[0].points).toEqual(3);
    expect(response.body[1].points).toEqual(2);
    expect(response.body[2].points).toEqual(1);
  });
});
