import request from 'supertest';
import { app } from '../../../app';
import { NotAuthorizedError, UserRole } from '@datn242/questify-common';

const BASE_URL = '/api/admin/island-templates';

describe('List Island Templates API', () => {
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

  it('returns an empty array when no templates exist', async () => {
    const cookie = await global.getAuthCookie();

    const response = await request(app).get(BASE_URL).set('Cookie', cookie).expect(200);

    expect(response.body.length).toEqual(0);
  });

  it('returns a list of all non-deleted templates', async () => {
    const adminCookie = await global.getAuthCookie();

    await global.createIslandTemplate('Template 1', 'https://example.com/template1.png');
    await global.createIslandTemplate('Template 2', 'https://example.com/template2.png');
    await global.createIslandTemplate('Template 3', 'https://example.com/template3.png');

    const deletedTemplate = await global.createIslandTemplate(
      'Deleted Template',
      'https://example.com/deleted.png',
    );
    deletedTemplate.isDeleted = true;
    deletedTemplate.deletedAt = new Date();
    await deletedTemplate.save();

    const response = await request(app).get(BASE_URL).set('Cookie', adminCookie).expect(200);

    expect(response.body.length).toEqual(3);

    const templateNames = response.body.map((template: any) => template.name);
    expect(templateNames).toContain('Template 1');
    expect(templateNames).toContain('Template 2');
    expect(templateNames).toContain('Template 3');
    expect(templateNames).not.toContain('Deleted Template');
  });
});
