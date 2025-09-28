import request from 'supertest';
import { app } from '../../../app';
import { Level } from '../../../models/level';
import { NotAuthorizedError, NotFoundError, BadRequestError } from '@datn242/questify-common';
import { v4 as uuidv4 } from 'uuid';

it('has a route handler listening to /api/course-mgmt/islands/:island_id/level for post requests', async () => {
  const island_id = uuidv4();
  const response = await request(app).post(`/api/course-mgmt/islands/${island_id}/level`).send({});

  expect(response.status).not.toEqual(NotFoundError.statusCode);
});

it('can only be accessed if the user is signed in', async () => {
  const island_id = uuidv4();
  await request(app)
    .post(`/api/course-mgmt/islands/${island_id}/level`)
    .send({})
    .expect(NotAuthorizedError.statusCode);
});

it(`returns a status other than ${NotAuthorizedError.statusCode} if the user is signed in`, async () => {
  const cookie = await global.getAuthCookie();
  const island_id = uuidv4();
  const response = await request(app)
    .post(`/api/course-mgmt/islands/${island_id}/level`)
    .set('Cookie', cookie)
    .send({});

  expect(response.status).not.toEqual(NotAuthorizedError.statusCode);
});

it('return BadRequestError if island not found', async () => {
  const cookie = await global.getAuthCookie();
  const island_id = uuidv4();
  await request(app)
    .post(`/api/course-mgmt/islands/${island_id}/level`)
    .set('Cookie', cookie)
    .send({
      name: 'Linked List',
      position: 1,
    })
    .expect(BadRequestError.statusCode);
});

it('returns an error if an invalid name or position is provided', async () => {
  const cookie = await global.getAuthCookie();
  const levels = await Level.findAll();
  expect(levels.length).toEqual(0);

  const course_res = await request(app)
    .post('/api/course-mgmt')
    .set('Cookie', cookie)
    .send({
      name: 'DSA',
    })
    .expect(201);

  const island_res = await request(app)
    .post(`/api/course-mgmt/${course_res.body.id}/islands`)
    .set('Cookie', cookie)
    .send({
      name: 'Linked List',
      position: 1,
    })
    .expect(201);

  await request(app)
    .post(`/api/course-mgmt/islands/${island_res.body.id}/level`)
    .set('Cookie', cookie)
    .send({
      name: '',
      position: 6,
    })
    .expect(BadRequestError.statusCode);

  await request(app)
    .post(`/api/course-mgmt/islands/${island_res.body.id}/level`)
    .set('Cookie', cookie)
    .send({
      position: 6,
    })
    .expect(BadRequestError.statusCode);

  await request(app)
    .post(`/api/course-mgmt/islands/${island_res.body.id}/level`)
    .set('Cookie', cookie)
    .send({
      name: 'Longest Substring Without Repeating Characters',
      position: 'this is number',
    })
    .expect(BadRequestError.statusCode);

  await request(app)
    .post(`/api/course-mgmt/islands/${island_res.body.id}/level`)
    .set('Cookie', cookie)
    .send({
      name: 'Longest Substring Without Repeating Characters',
    })
    .expect(BadRequestError.statusCode);
});

it('creates an Level with valid inputs', async () => {
  const cookie = await global.getAuthCookie();
  let levels = await Level.findAll();
  expect(levels.length).toEqual(0);

  const course_res = await request(app)
    .post('/api/course-mgmt')
    .set('Cookie', cookie)
    .send({
      name: 'DSA',
    })
    .expect(201);

  const island_res = await request(app)
    .post(`/api/course-mgmt/${course_res.body.id}/islands`)
    .set('Cookie', cookie)
    .send({
      name: 'Linked List',
      position: 1,
    })
    .expect(201);

  await request(app)
    .post(`/api/course-mgmt/islands/${island_res.body.id}/level`)
    .set('Cookie', cookie)
    .send({
      name: 'Longest Substring Without Repeating Characters',
      position: 6,
    })
    .expect(201);

  levels = await Level.findAll();
  expect(levels.length).toEqual(1);
  expect(levels[0].name).toEqual('Longest Substring Without Repeating Characters');
  expect(levels[0].position).toEqual(6);
});
