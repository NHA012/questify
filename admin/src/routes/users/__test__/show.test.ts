import request from 'supertest';
import { app } from '../../../app';
import { v4 as uuidv4 } from 'uuid';
import { NotAuthorizedError, NotFoundError, UserRole } from '@datn242/questify-common';

const BASE_URL = '/api/admin/users';

describe('Get User by ID API', () => {
  it('returns NotAuthorizedError if the user is not signed in', async () => {
    const userId = uuidv4();

    await request(app).get(`${BASE_URL}/${userId}`).expect(NotAuthorizedError.statusCode);
  });

  it('returns NotAuthorizedError if the user is not an admin', async () => {
    const userId = uuidv4();
    const cookie = await global.getAuthCookie(
      undefined,
      'teacher@test.com',
      'teacher',
      UserRole.Teacher,
    );

    await request(app)
      .get(`${BASE_URL}/${userId}`)
      .set('Cookie', cookie)
      .expect(NotAuthorizedError.statusCode);
  });

  it('returns NotFoundError if the user does not exist', async () => {
    const adminCookie = await global.getAuthCookie();
    const nonExistentUserId = uuidv4();

    await request(app)
      .get(`${BASE_URL}/${nonExistentUserId}`)
      .set('Cookie', adminCookie)
      .expect(NotFoundError.statusCode);
  });

  it('returns the user if found', async () => {
    const adminCookie = await global.getAuthCookie();

    const testUser = await global.createUser(
      undefined,
      'student@test.com',
      'student1',
      UserRole.Student,
    );

    const response = await request(app)
      .get(`${BASE_URL}/${testUser.id}`)
      .set('Cookie', adminCookie)
      .expect(200);

    expect(response.body.id).toEqual(testUser.id);
    expect(response.body.gmail).toEqual(testUser.gmail);
    expect(response.body.userName).toEqual(testUser.userName);
    expect(response.body.role).toEqual(testUser.role);
    expect(response.body.status).toEqual(testUser.status);
  });
});
