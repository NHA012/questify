import request from 'supertest';
import { app } from '../../../app';
import { v4 as uuidv4 } from 'uuid';
import { NotAuthorizedError, UserRole } from '@datn242/questify-common';
import { AdminIslandTemplateActionType } from '../../../models/admin-island-template';

const BASE_URL = '/api/admin/actions/island-templates';

describe('List Admin Island Template Actions API', () => {
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

  it('returns a list of all admin actions on island templates', async () => {
    const adminId = uuidv4();
    const adminCookie = await global.getAuthCookie(adminId);

    const template1 = await global.createIslandTemplate('Template 1');
    const template2 = await global.createIslandTemplate('Template 2');

    await global.createAdminIslandTemplateAction(
      adminId,
      template1.id,
      AdminIslandTemplateActionType.Add,
      'New template added',
    );

    await global.createAdminIslandTemplateAction(
      adminId,
      template2.id,
      AdminIslandTemplateActionType.Remove,
      'Obsolete template removed',
    );

    const response = await request(app).get(BASE_URL).set('Cookie', adminCookie).expect(200);

    expect(response.body.length).toEqual(2);

    const actionTypes = response.body.map((action: any) => action.actionType);
    expect(actionTypes).toContain(AdminIslandTemplateActionType.Add);
    expect(actionTypes).toContain(AdminIslandTemplateActionType.Remove);

    expect(response.body[0].admin).toBeDefined();
    expect(response.body[0].islandTemplate).toBeDefined();
    expect(response.body[0].islandTemplate.name).toBeDefined();
  });
});
