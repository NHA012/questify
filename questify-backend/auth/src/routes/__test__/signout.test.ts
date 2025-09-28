import request from 'supertest';
import { app } from '../../app';

const signUp = async () => {
  const firstResponse = await request(app)
    .post('/api/users/validate-credentials')
    .send({
      userName: 'test',
      email: 'test@datn242.com',
    })
    .expect(200);

  const cookies = firstResponse.get('Set-Cookie');

  return await request(app)
    .post('/api/users/complete-signup')
    .set('Cookie', cookies || [])
    .send({
      password: 'password',
      confirmedPassword: 'password',
    })
    .expect(201);
};

it('clears the cookie after signing out', async () => {
  await signUp();

  const response = await request(app).post('/api/users/signout').send({}).expect(200);

  const cookie = response.get('Set-Cookie');
  if (!cookie) {
    throw new Error('Expected cookie but got undefined.');
  }

  expect(cookie[0]).toEqual('session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; httponly');
});
