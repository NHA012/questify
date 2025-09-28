import request from 'supertest';
import { app } from '../../../app';
import { v4 as uuidv4 } from 'uuid';
import {
  NotAuthorizedError,
  NotFoundError,
  BadRequestError,
  RequestValidationError,
  UserRole,
  UserStatus,
} from '@datn242/questify-common';
import { AdminActionType } from '../../../models/admin-user';

const BASE_URL = '/api/admin/users';

describe('Update User Status API', () => {
  it('returns NotAuthorizedError if the user is not signed in', async () => {
    const userId = uuidv4();

    await request(app)
      .patch(`${BASE_URL}/${userId}`)
      .send({
        status: UserStatus.Suspended,
        reason: 'Violation of terms',
      })
      .expect(NotAuthorizedError.statusCode);
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
      .patch(`${BASE_URL}/${userId}`)
      .set('Cookie', cookie)
      .send({
        status: UserStatus.Suspended,
        reason: 'Violation of terms',
      })
      .expect(NotAuthorizedError.statusCode);
  });

  it('returns NotFoundError if the user does not exist', async () => {
    const adminCookie = await global.getAuthCookie();
    const nonExistentUserId = uuidv4();

    await request(app)
      .patch(`${BASE_URL}/${nonExistentUserId}`)
      .set('Cookie', adminCookie)
      .send({
        status: UserStatus.Suspended,
        reason: 'Violation of terms',
      })
      .expect(NotFoundError.statusCode);
  });

  it('returns RequestValidationError if the status is invalid', async () => {
    const adminCookie = await global.getAuthCookie();

    const testUser = await global.createUser();

    await request(app)
      .patch(`${BASE_URL}/${testUser.id}`)
      .set('Cookie', adminCookie)
      .send({
        status: 'invalid-status',
        reason: 'Violation of terms',
      })
      .expect((res) => {
        expect(res.status).toBe(RequestValidationError.statusCode);
        expect(res.text).toContain('Status must be either Active or Suspended');
      });
  });

  it('successfully suspends a user', async () => {
    const adminId = uuidv4();
    const adminCookie = await global.getAuthCookie(adminId);

    const testUser = await global.createUser();
    expect(testUser.status).toEqual(UserStatus.Active);

    const response = await request(app)
      .patch(`${BASE_URL}/${testUser.id}`)
      .set('Cookie', adminCookie)
      .send({
        status: UserStatus.Suspended,
        reason: 'Violation of terms',
      })
      .expect(200);

    expect(response.body.id).toEqual(testUser.id);
    expect(response.body.status).toEqual(UserStatus.Suspended);

    const { adminAction } = response.body;
    expect(adminAction).toBeDefined();
    expect(adminAction.adminId).toEqual(adminId);
    expect(adminAction.userId).toEqual(testUser.id);
    expect(adminAction.actionType).toEqual(AdminActionType.Suspend);
    expect(adminAction.reason).toEqual('Violation of terms');
  });

  it('successfully reactivates a suspended user', async () => {
    const adminId = uuidv4();
    const adminCookie = await global.getAuthCookie(adminId);

    const testUser = await global.createUser(
      undefined,
      'suspended@test.com',
      'suspended',
      UserRole.Student,
      UserStatus.Suspended,
    );
    expect(testUser.status).toEqual(UserStatus.Suspended);

    const response = await request(app)
      .patch(`${BASE_URL}/${testUser.id}`)
      .set('Cookie', adminCookie)
      .send({
        status: UserStatus.Active,
      })
      .expect(200);

    expect(response.body.id).toEqual(testUser.id);
    expect(response.body.status).toEqual(UserStatus.Active);
  });

  it('prevents admin from suspending any admin', async () => {
    const adminId = uuidv4();
    const adminCookie = await global.getAuthCookie(adminId);

    const anotherAdmin = await global.createUser(
      undefined,
      'admin2@test.com',
      'admin2',
      UserRole.Admin,
    );

    await request(app)
      .patch(`${BASE_URL}/${anotherAdmin.id}`)
      .set('Cookie', adminCookie)
      .send({
        status: UserStatus.Suspended,
        reason: 'Admin suspension test',
      })
      .expect((res) => {
        expect(res.status).toBe(BadRequestError.statusCode);
        expect(res.text).toContain('Admins cannot suspend other admins');
      });
  });

  it('allows suspending a user without a reason', async () => {
    const adminId = uuidv4();
    const adminCookie = await global.getAuthCookie(adminId);

    const testUser = await global.createUser();
    expect(testUser.status).toEqual(UserStatus.Active);

    const response = await request(app)
      .patch(`${BASE_URL}/${testUser.id}`)
      .set('Cookie', adminCookie)
      .send({
        status: UserStatus.Suspended,
      })
      .expect(200);

    expect(response.body.id).toEqual(testUser.id);
    expect(response.body.status).toEqual(UserStatus.Suspended);
  });
});
