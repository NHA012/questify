import request from 'supertest';
import { app } from '../../../app';
import { NotAuthorizedError, UserRole, CourseStatus } from '@datn242/questify-common';

const BASE_URL = '/api/admin/courses';

describe('List All Courses API', () => {
  it('returns NotAuthorizedError if the user is not signed in', async () => {
    await request(app).get(BASE_URL).expect(NotAuthorizedError.statusCode);
  });

  it('returns NotAuthorizedError if the user is not an admin', async () => {
    const cookie = await global.getAuthCookie(
      undefined,
      'teacher@test.com',
      'teacher',
      UserRole.Teacher,
    );

    await request(app)
      .get(BASE_URL)
      .set('Cookie', cookie)

      .expect(NotAuthorizedError.statusCode);
  });

  it('returns an empty array when no courses exist', async () => {
    const cookie = await global.getAuthCookie();

    const response = await request(app).get(BASE_URL).set('Cookie', cookie).expect(200);

    expect(response.body.length).toEqual(0);
  });

  it('returns a list of all courses', async () => {
    const adminCookie = await global.getAuthCookie();

    const teacher = await global.createUser(
      undefined,
      'teacher@test.com',
      'teacher',
      UserRole.Teacher,
    );

    await global.createCourse(teacher.id, 'Course 1', 'Description 1', CourseStatus.Pending);

    await global.createCourse(teacher.id, 'Course 2', 'Description 2', CourseStatus.Approved);

    await global.createCourse(teacher.id, 'Course 3', 'Description 3', CourseStatus.Rejected);

    const response = await request(app).get(BASE_URL).set('Cookie', adminCookie).expect(200);

    expect(response.body.length).toEqual(3);

    const statuses = response.body.map((course: any) => course.status);
    expect(statuses).toContain(CourseStatus.Pending);
    expect(statuses).toContain(CourseStatus.Approved);
    expect(statuses).toContain(CourseStatus.Rejected);

    expect(response.body[0].teacher).toBeDefined();
    expect(response.body[0].teacher.id).toEqual(teacher.id);
  });

  it('returns only non-deleted courses', async () => {
    const adminCookie = await global.getAuthCookie();

    const teacher = await global.createUser(
      undefined,
      'teacher@test.com',
      'teacher',
      UserRole.Teacher,
    );

    await global.createCourse(teacher.id, 'Active Course');

    const deletedCourse = await global.createCourse(teacher.id, 'Deleted Course');
    deletedCourse.isDeleted = true;
    deletedCourse.deletedAt = new Date();
    await deletedCourse.save();

    const response = await request(app).get(BASE_URL).set('Cookie', adminCookie).expect(200);

    expect(response.body.length).toEqual(1);
    expect(response.body[0].name).toEqual('Active Course');
  });
});
