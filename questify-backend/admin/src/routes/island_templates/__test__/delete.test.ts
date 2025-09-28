import request from 'supertest';
import { app } from '../../../app';
import { v4 as uuidv4 } from 'uuid';
import {
  NotAuthorizedError,
  NotFoundError,
  BadRequestError,
  UserRole,
} from '@datn242/questify-common';
import { AdminIslandTemplateActionType } from '../../../models/admin-island-template';
import { IslandTemplate } from '../../../models/island-template';

const BASE_URL = '/api/admin/island-templates';

describe('Delete Island Template API', () => {
  it('returns NotAuthorizedError if the user is not signed in', async () => {
    const templateId = uuidv4();

    await request(app)
      .delete(`${BASE_URL}/${templateId}`)
      .send({
        reason: 'Obsolete template',
      })
      .expect(NotAuthorizedError.statusCode);
  });

  it('returns NotAuthorizedError if the user is not an admin', async () => {
    const templateId = uuidv4();
    const cookie = await global.getAuthCookie(
      undefined,
      'teacher@test.com',
      'teacher',
      UserRole.Teacher,
    );

    await request(app)
      .delete(`${BASE_URL}/${templateId}`)
      .set('Cookie', cookie)
      .send({
        reason: 'Obsolete template',
      })
      .expect(NotAuthorizedError.statusCode);
  });

  it('returns NotFoundError if the template does not exist', async () => {
    const adminCookie = await global.getAuthCookie();
    const nonExistentTemplateId = uuidv4();

    await request(app)
      .delete(`${BASE_URL}/${nonExistentTemplateId}`)
      .set('Cookie', adminCookie)
      .send({
        reason: 'Obsolete template',
      })
      .expect((res) => {
        expect(res.status).toBe(NotFoundError.statusCode);
        expect(res.text).toContain('Not Found');
      });
  });

  it('successfully marks a template as deleted', async () => {
    const adminId = uuidv4();
    const adminCookie = await global.getAuthCookie(adminId);

    const template = await global.createIslandTemplate('Template to Delete');
    expect(template.isDeleted).toEqual(false);

    const response = await request(app)
      .delete(`${BASE_URL}/${template.id}`)
      .set('Cookie', adminCookie)
      .send({
        reason: 'Obsolete template design',
      })
      .expect(200);

    expect(response.body.id).toEqual(template.id);
    expect(response.body.isDeleted).toEqual(true);
    expect(response.body.deletedAt).toBeDefined();

    const { adminAction } = response.body;
    expect(adminAction).toBeDefined();
    expect(adminAction.adminId).toEqual(adminId);
    expect(adminAction.islandTemplateId).toEqual(template.id);
    expect(adminAction.actionType).toEqual(AdminIslandTemplateActionType.Remove);
    expect(adminAction.reason).toEqual('Obsolete template design');

    const updatedTemplate = await IslandTemplate.findByPk(template.id);
    expect(updatedTemplate?.isDeleted).toEqual(true);
    expect(updatedTemplate?.deletedAt).toBeDefined();
  });

  it('returns BadRequestError if template is already deleted', async () => {
    const adminCookie = await global.getAuthCookie();

    const template = await global.createIslandTemplate('Already Deleted');
    template.isDeleted = true;
    template.deletedAt = new Date();
    await template.save();

    await request(app)
      .delete(`${BASE_URL}/${template.id}`)
      .set('Cookie', adminCookie)
      .send({
        reason: 'Second deletion attempt',
      })
      .expect((res) => {
        expect(res.status).toBe(BadRequestError.statusCode);
        expect(res.text).toContain('This template is already deleted');
      });
  });
});
