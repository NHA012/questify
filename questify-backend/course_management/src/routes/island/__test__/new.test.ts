import request from 'supertest';
import { app } from '../../../app';
import { Island } from '../../../models/island';
import { NotAuthorizedError, NotFoundError, BadRequestError } from '@datn242/questify-common';
import { v4 as uuidv4 } from 'uuid';

it('has a route handler listening to /api/course-mgmt/:course_id/islands for post requests', async () => {
  const course_id = uuidv4();
  const response = await request(app).post(`/api/course-mgmt/${course_id}/islands`).send({});

  expect(response.status).not.toEqual(NotFoundError.statusCode);
});

it('can only be accessed if the user is signed in', async () => {
  const course_id = uuidv4();
  await request(app)
    .post(`/api/course-mgmt/${course_id}/islands`)
    .send({})
    .expect(NotAuthorizedError.statusCode);
});

it(`returns a status other than ${NotAuthorizedError.statusCode} if the user is signed in`, async () => {
  const cookie = await global.getAuthCookie();
  const course_id = uuidv4();
  const response = await request(app)
    .post(`/api/course-mgmt/${course_id}/islands`)
    .set('Cookie', cookie)
    .send({});

  expect(response.status).not.toEqual(NotAuthorizedError.statusCode);
});

it('return BadRequestError if course not found', async () => {
  const cookie = await global.getAuthCookie();
  const course_id = uuidv4();
  await request(app)
    .post(`/api/course-mgmt/${course_id}/islands`)
    .set('Cookie', cookie)
    .send({
      name: 'Linked List',
      position: 1,
    })
    .expect(BadRequestError.statusCode);
});

it('returns an error if an invalid name is provided', async () => {
  const cookie = await global.getAuthCookie();
  const course_res = await request(app)
    .post('/api/course-mgmt')
    .set('Cookie', cookie)
    .send({
      name: 'DSA',
    })
    .expect(201);

  await request(app)
    .post(`/api/course-mgmt/${course_res.body.id}/islands`)
    .set('Cookie', cookie)
    .send({
      name: '',
      position: 1,
    })
    .expect(BadRequestError.statusCode);

  await request(app)
    .post(`/api/course-mgmt/${course_res.body.id}/islands`)
    .set('Cookie', cookie)
    .send({
      position: 1,
    })
    .expect(BadRequestError.statusCode);
});

it('creates an Island with valid inputs', async () => {
  const cookie = await global.getAuthCookie();
  let Islands = await Island.findAll();
  expect(Islands.length).toEqual(0);
  const course_res = await request(app)
    .post('/api/course-mgmt')
    .set('Cookie', cookie)
    .send({
      name: 'DSA',
    })
    .expect(201);

  await request(app)
    .post(`/api/course-mgmt/${course_res.body.id}/islands`)
    .set('Cookie', cookie)
    .send({
      name: 'Linked List',
    })
    .expect(201);

  Islands = await Island.findAll();
  expect(Islands.length).toEqual(1);
  expect(Islands[0].name).toEqual('Linked List');
  expect(Islands[0].position).toEqual(0);
});
