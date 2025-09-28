import request from 'supertest';
import { app } from '../../app';
import {
  RequestValidationError,
  BadRequestError,
  NotFoundError,
  UserRole,
} from '@datn242/questify-common';
import { User } from '../../models/user';
import { natsWrapper } from '../../nats-wrapper';

describe('1st signup page: validate userName and email', () => {
  it('return RequestValidationError when input invalid userName or email', async () => {
    await request(app)
      .post('/api/users/validate-credentials')
      .send({
        userName: 'ab',
        email: 'test@datn242.com',
      })
      .expect(BadRequestError.statusCode);
    await request(app)
      .post('/api/users/validate-credentials')
      .send({
        email: 'test@datn242.com',
      })
      .expect(BadRequestError.statusCode);
    await request(app)
      .post('/api/users/validate-credentials')
      .send({
        userName: 'test',
      })
      .expect(BadRequestError.statusCode);
    await request(app)
      .post('/api/users/validate-credentials')
      .send({
        userName: 'test',
        email: 'testdatn242.com',
      })
      .expect(BadRequestError.statusCode);
  });

  it('return BadRequestError with an existing email', async () => {
    const user = User.build({
      userName: 'test',
      email: 'test@datn242.com',
      password: 'password',
      role: UserRole.Student,
    });

    await user.save();
    await request(app)
      .post('/api/users/validate-credentials')
      .send({
        userName: 'test_boy',
        email: 'test@datn242.com',
      })
      .expect(BadRequestError.statusCode);
  });

  it('return BadRequestError with an existing userName', async () => {
    const user = User.build({
      userName: 'test',
      email: 'test@datn242.com',
      password: 'password',
      role: UserRole.Student,
    });

    await user.save();
    await request(app)
      .post('/api/users/validate-credentials')
      .send({
        userName: 'test',
        email: 'test@datn333.com',
      })
      .expect(BadRequestError.statusCode);
  });

  it('set cookie after input valida email and username', async () => {
    const response = await request(app)
      .post('/api/users/validate-credentials')
      .send({
        userName: 'test',
        email: 'test@datn242.com',
      })
      .expect(200);

    expect(response.get('Set-Cookie')).toBeDefined();
  });
});

describe('2nd signup page: complete signup', () => {
  it('return RequestValidationError when input invalid password', async () => {
    await request(app)
      .post('/api/users/complete-signup')
      .send({
        password: 'p',
        confirmedPassword: 'password',
      })
      .expect(RequestValidationError.statusCode);
  });

  it('return BadRequestError with invalid cookie session (havent pass 1st signup page)', async () => {
    await request(app)
      .post('/api/users/complete-signup')
      .send({
        password: 'password',
        confirmedPassword: 'password',
      })
      .expect(NotFoundError.statusCode);
  });

  it('return BadRequestError when password not match confirmedPassword', async () => {
    const firstResponse = await request(app)
      .post('/api/users/validate-credentials')
      .send({
        userName: 'test',
        email: 'test@datn242.com',
      })
      .expect(200);

    const cookies = firstResponse.get('Set-Cookie');

    await request(app)
      .post('/api/users/complete-signup')
      .set('Cookie', cookies || [])
      .send({
        password: 'password',
        confirmedPassword: 'password123',
      })
      .expect(BadRequestError.statusCode);
  });

  it('set cookie after pass 1st page and input valid password', async () => {
    const firstResponse = await request(app)
      .post('/api/users/validate-credentials')
      .send({
        userName: 'test',
        email: 'test@datn242.com',
      })
      .expect(200);

    const cookies = firstResponse.get('Set-Cookie');

    const response = await request(app)
      .post('/api/users/complete-signup')
      .set('Cookie', cookies || [])
      .send({
        password: 'password',
        confirmedPassword: 'password',
      })
      .expect(201);

    expect(response.get('Set-Cookie')).toBeDefined();
    expect(response.body.email).toEqual('test@datn242.com');
    expect(response.body.userName).toEqual('test');
    expect(natsWrapper.client.publish).toHaveBeenCalled();
  });
});
