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

it('fails when an email that does not exist is supplied', async () => {
  await request(app)
    .post('/api/users/signin')
    .send({
      email: 'test@test.com',
      password: 'password',
    })
    .expect(400);
});

it('fails when an incorrect password is supplied', async () => {
  await signUp();

  await request(app)
    .post('/api/users/signin')
    .send({
      email: 'test@datn242.com',
      password: 'password1',
    })
    .expect(400);
});

it('responds with a cookie when given valid credentials', async () => {
  await signUp();

  const response = await request(app)
    .post('/api/users/signin')
    .send({
      email: 'test@datn242.com',
      password: 'password',
    })
    .expect(200);

  expect(response.get('Set-Cookie')).toBeDefined();
});
