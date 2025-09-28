import request from 'supertest';
import { app } from '../../../app';

const createTicket = async (gmail: string) => {
  const cookie = await global.getAuthCookie(gmail);
  return request(app).post('/api/course-mgmt').set('Cookie', cookie).send({
    name: 'dsa',
  });
};

it('can fetch a list of tickets', async () => {
  await createTicket(`test1@gmail.com`);
  await createTicket(`test2@gmail.com`);
  await createTicket(`test3@gmail.com`);

  const response = await request(app).get('/api/course-mgmt').send().expect(200);

  expect(response.body.length).toEqual(0);
});
