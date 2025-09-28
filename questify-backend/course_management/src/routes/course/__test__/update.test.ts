import request from 'supertest';
import { app } from '../../../app';
import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import {
  NotFoundError,
  NotAuthorizedError,
  RequestValidationError,
} from '@datn242/questify-common';

it('returns a 404 if the provided id does not exist', async () => {
  const course_id = uuidv4();
  const cookie = await global.getAuthCookie();
  await request(app)
    .patch(`/api/course-mgmt/course/${course_id}`)
    .set('Cookie', cookie)
    .send({
      name: 'dsa',
    })
    .expect(NotFoundError.statusCode);
});

it('returns a 401 if the user is not authorized', async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  await request(app)
    .patch(`/api/course-mgmt/course/${id}`)
    .send({
      title: 'aslkdfj',
      price: 20,
    })
    .expect(NotAuthorizedError.statusCode);
});

it('returns a 401 if the user does not own the course', async () => {
  const cookie1 = await global.getAuthCookie('test1@gmail.com');
  const response = await request(app).post('/api/course-mgmt').set('Cookie', cookie1).send({
    name: 'DSA',
  });
  const cookie2 = await global.getAuthCookie('test2@gmail.com');
  await request(app)
    .patch(`/api/course-mgmt/course/${response.body.id}`)
    .set('Cookie', cookie2)
    .send({
      name: 'Compatcher Architecture',
    })
    .expect(NotAuthorizedError.statusCode);
});

it('returns a RequestValidationError if the user provides an invalid name', async () => {
  const cookie = await global.getAuthCookie();

  const response = await request(app).post('/api/course-mgmt').set('Cookie', cookie).send({
    name: 'DSA',
  });

  await request(app)
    .patch(`/api/course-mgmt/course/${response.body.id}`)
    .set('Cookie', cookie)
    .send({
      name: '',
    })
    .expect(RequestValidationError.statusCode);
});

it('updates the course provided valid inpatchs', async () => {
  const cookie = await global.getAuthCookie();
  const response = await request(app)
    .post('/api/course-mgmt')
    .set('Cookie', cookie)
    .send({
      name: 'DSA',
    })
    .expect(201);

  await request(app)
    .patch(`/api/course-mgmt/course/${response.body.id}`)
    .set('Cookie', cookie)
    .send({
      name: 'Compatcher Architecture',
    })
    .expect(200);

  const courseResponse = await request(app)
    .get(`/api/course-mgmt/course/${response.body.id}`)
    .send();

  expect(courseResponse.body.name).toEqual('Compatcher Architecture');
});
