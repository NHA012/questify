import request from 'supertest';
import { app } from '../../../app';
import { v4 as uuidv4 } from 'uuid';
import { NotAuthorizedError, UserRole } from '@datn242/questify-common';
import { AdminActionType } from '../../../models/admin-user';

const BASE_URL = '/api/admin/actions/users';

describe('List Admin User Actions API', () => {
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

  it('returns an empty array when no actions exist', async () => {
    const cookie = await global.getAuthCookie();

    const response = await request(app).get(BASE_URL).set('Cookie', cookie).expect(200);

    expect(response.body.length).toEqual(0);
  });

  it('returns a list of all admin actions on users', async () => {
    const adminId = uuidv4();
    const adminCookie = await global.getAuthCookie(adminId);

    const user1 = await global.createUser(undefined, 'user1@test.com', 'user1');

    const user2 = await global.createUser(undefined, 'user2@test.com', 'user2');

    await global.createAdminUserAction(
      adminId,
      user1.id,
      AdminActionType.Suspend,
      'Violation of terms',
    );

    await global.createAdminUserAction(
      adminId,
      user2.id,
      AdminActionType.Suspend,
      'Inappropriate content',
    );

    const response = await request(app).get(BASE_URL).set('Cookie', adminCookie).expect(200);

    expect(response.body.length).toEqual(2);

    expect(response.body[0].adminId).toEqual(adminId);
    expect(response.body[0].actionType).toEqual(AdminActionType.Suspend);

    expect(response.body[0].admin).toBeDefined();
    expect(response.body[0].targetUser).toBeDefined();
    expect(response.body[0].targetUser.id).toBeDefined();
  });
});
