import request from 'supertest';
import { app } from '../../../app';
import { v4 as uuidv4 } from 'uuid';
import {
  RequestValidationError,
  NotFoundError,
  NotAuthorizedError,
} from '@datn242/questify-common';

it('returns a NotAuthorizedError if the user is not signin', async () => {
  const course_id = uuidv4();
  const island_id = uuidv4();
  await request(app)
    .patch(`/api/course-mgmt/${course_id}/islands/${island_id}`)
    .send()
    .expect(NotAuthorizedError.statusCode);
});

it('returns a NotFoundError if the provided course_id does not exist', async () => {
  const cookie = await global.getAuthCookie();
  const course_id = uuidv4();
  const island_id = uuidv4();
  await request(app)
    .patch(`/api/course-mgmt/${course_id}/islands/${island_id}`)
    .set('Cookie', cookie)
    .send()
    .expect(NotFoundError.statusCode);
});

it('returns a NotAuthorizedError if the user does not own the course', async () => {
  const cookie1 = await global.getAuthCookie('test1@gmail.com');
  const response = await request(app).post('/api/course-mgmt').set('Cookie', cookie1).send({
    name: 'DSA',
  });
  const cookie2 = await global.getAuthCookie('test2@gmail.com');
  const island_id = uuidv4();
  await request(app)
    .patch(`/api/course-mgmt/${response.body.id}/islands/${island_id}`)
    .set('Cookie', cookie2)
    .send({
      name: 'Compatcher Architecture',
    })
    .expect(NotAuthorizedError.statusCode);
});

it('returns a NotFoundError if the provided island_id does not exist', async () => {
  const cookie = await global.getAuthCookie();
  const courseRes = await request(app)
    .post('/api/course-mgmt')
    .set('Cookie', cookie)
    .send({
      name: 'DSA',
    })
    .expect(201);
  const island_id = uuidv4();
  await request(app)
    .patch(`/api/course-mgmt/${courseRes.body.id}/islands/${island_id}`)
    .set('Cookie', cookie)
    .send()
    .expect(NotFoundError.statusCode);
});

it('returns a RequestValidationError if the user provides an invalid position or name', async () => {
  const cookie = await global.getAuthCookie();

  const courseRes = await request(app)
    .post('/api/course-mgmt')
    .set('Cookie', cookie)
    .send({
      name: 'DSA',
    })
    .expect(201);

  const islandRes = await request(app)
    .post(`/api/course-mgmt/${courseRes.body.id}/islands`)
    .set('Cookie', cookie)
    .send({
      name: 'Linked List',
    })
    .expect(201);

  await request(app)
    .patch(`/api/course-mgmt/${courseRes.body.id}/islands/${islandRes.body.id}`)
    .set('Cookie', cookie)
    .send({
      name: '',
    })
    .expect(RequestValidationError.statusCode);

  await request(app)
    .patch(`/api/course-mgmt/${courseRes.body.id}/islands/${islandRes.body.id}`)
    .set('Cookie', cookie)
    .send({
      position: '999rand',
    })
    .expect(RequestValidationError.statusCode);
});

it('updates the course provided valid inpatchs', async () => {
  const cookie = await global.getAuthCookie();

  const courseRes = await request(app)
    .post('/api/course-mgmt')
    .set('Cookie', cookie)
    .send({
      name: 'DSA',
    })
    .expect(201);

  const islandRes = await request(app)
    .post(`/api/course-mgmt/${courseRes.body.id}/islands`)
    .set('Cookie', cookie)
    .send({
      name: 'Linked List',
    })
    .expect(201);

  const response = await request(app)
    .patch(`/api/course-mgmt/${courseRes.body.id}/islands/${islandRes.body.id}`)
    .set('Cookie', cookie)
    .send({
      name: 'Sliding window',
    })
    .expect(200);

  expect(response.body.name).toEqual('Sliding window');
});
