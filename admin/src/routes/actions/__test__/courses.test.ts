import request from 'supertest';
import { app } from '../../../app';
import { v4 as uuidv4 } from 'uuid';
import { NotAuthorizedError, UserRole } from '@datn242/questify-common';
import { AdminCourseActionType } from '../../../models/admin-course';

const BASE_URL = '/api/admin/actions/courses';

describe('List Admin Course Actions API', () => {
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

    await request(app).get(BASE_URL).set('Cookie', cookie).expect(NotAuthorizedError.statusCode);
  });

  it('returns an empty array when no actions exist', async () => {
    const cookie = await global.getAuthCookie();

    const response = await request(app).get(BASE_URL).set('Cookie', cookie).expect(200);

    expect(response.body.length).toEqual(0);
  });

  it('returns a list of all admin actions on courses', async () => {
    const adminId = uuidv4();
    const adminCookie = await global.getAuthCookie(adminId);

    const teacher = await global.createUser(
      undefined,
      'teacher@test.com',
      'teacher',
      UserRole.Teacher,
    );

    const course1 = await global.createCourse(teacher.id, 'Course 1', 'Description 1');

    const course2 = await global.createCourse(teacher.id, 'Course 2', 'Description 2');

    await global.createAdminCourseAction(
      adminId,
      course1.id,
      AdminCourseActionType.Approve,
      'Meets quality standards',
    );

    await global.createAdminCourseAction(
      adminId,
      course2.id,
      AdminCourseActionType.Reject,
      'Does not meet requirements',
    );

    const response = await request(app).get(BASE_URL).set('Cookie', adminCookie).expect(200);

    expect(response.body.length).toEqual(2);

    const actionTypes = response.body.map((action: any) => action.actionType);
    expect(actionTypes).toContain(AdminCourseActionType.Approve);
    expect(actionTypes).toContain(AdminCourseActionType.Reject);

    expect(response.body[0].admin).toBeDefined();
    expect(response.body[0].course).toBeDefined();
    expect(response.body[0].course.name).toBeDefined();
  });
});
