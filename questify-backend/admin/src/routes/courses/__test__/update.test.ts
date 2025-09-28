import request from 'supertest';
import { app } from '../../../app';
import { v4 as uuidv4 } from 'uuid';
import {
  NotAuthorizedError,
  NotFoundError,
  RequestValidationError,
  BadRequestError,
  UserRole,
  CourseStatus,
} from '@datn242/questify-common';
import { AdminCourseActionType } from '../../../models/admin-course';

const BASE_URL = '/api/admin/courses';

describe('Update Course Status API', () => {
  it('returns NotAuthorizedError if the user is not signed in', async () => {
    const courseId = uuidv4();

    await request(app)
      .patch(`${BASE_URL}/${courseId}`)
      .send({
        status: CourseStatus.Approved,
        reason: 'Course meets standards',
      })
      .expect(NotAuthorizedError.statusCode);
  });

  it('returns NotAuthorizedError if the user is not an admin', async () => {
    const courseId = uuidv4();
    const cookie = await global.getAuthCookie(
      undefined,
      'teacher@test.com',
      'teacher',
      UserRole.Teacher,
    );

    await request(app)
      .patch(`${BASE_URL}/${courseId}`)
      .set('Cookie', cookie)
      .send({
        status: CourseStatus.Approved,
        reason: 'Course meets standards',
      })
      .expect(NotAuthorizedError.statusCode);
  });

  it('returns NotFoundError if the course does not exist', async () => {
    const adminCookie = await global.getAuthCookie();
    const nonExistentCourseId = uuidv4();

    await request(app)
      .patch(`${BASE_URL}/${nonExistentCourseId}`)
      .set('Cookie', adminCookie)
      .send({
        status: CourseStatus.Approved,
        reason: 'Course meets standards',
      })
      .expect(NotFoundError.statusCode);
  });

  it('returns RequestValidationError if the status is invalid', async () => {
    const adminCookie = await global.getAuthCookie();

    const teacher = await global.createUser(
      undefined,
      'teacher@test.com',
      'teacher',
      UserRole.Teacher,
    );

    const course = await global.createCourse(teacher.id);

    await request(app)
      .patch(`${BASE_URL}/${course.id}`)
      .set('Cookie', adminCookie)
      .send({
        status: 'invalid-status',
        reason: 'Course meets standards',
      })
      .expect((res) => {
        expect(res.status).toBe(RequestValidationError.statusCode);
        expect(res.text).toContain('Status must be either Approved or Rejected');
      });
  });

  it('successfully approves a pending course', async () => {
    const adminId = uuidv4();
    const adminCookie = await global.getAuthCookie(adminId);

    const teacher = await global.createUser(
      undefined,
      'teacher@test.com',
      'teacher',
      UserRole.Teacher,
    );

    const course = await global.createCourse(
      teacher.id,
      'Pending Course',
      'Pending Course Description',
      CourseStatus.Pending,
    );

    expect(course.status).toEqual(CourseStatus.Pending);

    const response = await request(app)
      .patch(`${BASE_URL}/${course.id}`)
      .set('Cookie', adminCookie)
      .send({
        status: CourseStatus.Approved,
        reason: 'Course meets quality standards',
      })
      .expect(200);

    expect(response.body.id).toEqual(course.id);
    expect(response.body.status).toEqual(CourseStatus.Approved);

    const { adminAction } = response.body;
    expect(adminAction).toBeDefined();
    expect(adminAction.adminId).toEqual(adminId);
    expect(adminAction.courseId).toEqual(course.id);
    expect(adminAction.actionType).toEqual(AdminCourseActionType.Approve);
    expect(adminAction.reason).toEqual('Course meets quality standards');
  });

  it('successfully rejects a pending course', async () => {
    const adminId = uuidv4();
    const adminCookie = await global.getAuthCookie(adminId);

    const teacher = await global.createUser(
      undefined,
      'teacher@test.com',
      'teacher',
      UserRole.Teacher,
    );

    const course = await global.createCourse(
      teacher.id,
      'Pending Course',
      'Pending Course Description',
      CourseStatus.Pending,
    );

    expect(course.status).toEqual(CourseStatus.Pending);

    const response = await request(app)
      .patch(`${BASE_URL}/${course.id}`)
      .set('Cookie', adminCookie)
      .send({
        status: CourseStatus.Rejected,
        reason: 'Course does not meet minimum requirements',
      })
      .expect(200);

    expect(response.body.id).toEqual(course.id);
    expect(response.body.status).toEqual(CourseStatus.Rejected);

    const { adminAction } = response.body;
    expect(adminAction).toBeDefined();
    expect(adminAction.adminId).toEqual(adminId);
    expect(adminAction.courseId).toEqual(course.id);
    expect(adminAction.actionType).toEqual(AdminCourseActionType.Reject);
    expect(adminAction.reason).toEqual('Course does not meet minimum requirements');
  });

  it('returns BadRequestError when updating an already approved or rejected course', async () => {
    const adminCookie = await global.getAuthCookie();

    const teacher = await global.createUser(
      undefined,
      'teacher@test.com',
      'teacher',
      UserRole.Teacher,
    );

    const approvedCourse = await global.createCourse(
      teacher.id,
      'Approved Course',
      'Approved Course Description',
      CourseStatus.Approved,
    );

    await request(app)
      .patch(`${BASE_URL}/${approvedCourse.id}`)
      .set('Cookie', adminCookie)
      .send({
        status: CourseStatus.Rejected,
        reason: 'Attempt to reject approved course',
      })
      .expect((res) => {
        expect(res.status).toBe(BadRequestError.statusCode);
        expect(res.text).toContain('Only pending courses can be updated');
      });
  });
});
