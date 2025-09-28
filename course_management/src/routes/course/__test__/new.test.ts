import request from 'supertest';
import { app } from '../../../app';
import { Course } from '../../../models/course';
import {
  NotAuthorizedError,
  RequestValidationError,
  NotFoundError,
} from '@datn242/questify-common';

it('has a route handler listening to /api/course-mgmt for post requests', async () => {
  const response = await request(app).post('/api/course-mgmt').send({});

  expect(response.status).not.toEqual(NotFoundError.statusCode);
});

it('can only be accessed if the user is signed in', async () => {
  await request(app).post('/api/course-mgmt').send({}).expect(NotAuthorizedError.statusCode);
});

it(`returns a status other than ${NotAuthorizedError.statusCode} if the user is signed in`, async () => {
  const cookie = await global.getAuthCookie();
  const response = await request(app).post('/api/course-mgmt').set('Cookie', cookie).send({});

  expect(response.status).not.toEqual(NotAuthorizedError.statusCode);
});

it('returns an error if an invalid name is provided', async () => {
  const cookie = await global.getAuthCookie();
  await request(app)
    .post('/api/course-mgmt')
    .set('Cookie', cookie)
    .send({
      name: '',
    })
    .expect(RequestValidationError.statusCode);

  await request(app)
    .post('/api/course-mgmt')
    .set('Cookie', cookie)
    .send({})
    .expect(RequestValidationError.statusCode);
});

it('creates a Course with valid inputs', async () => {
  const cookie = await global.getAuthCookie();
  let Courses = await Course.findAll();
  expect(Courses.length).toEqual(0);

  const name = 'DSA';

  await request(app)
    .post('/api/course-mgmt')
    .set('Cookie', cookie)
    .send({
      name: name,
    })
    .expect(201);

  Courses = await Course.findAll();
  expect(Courses.length).toEqual(1);
  expect(Courses[0].name).toEqual(name);
});
