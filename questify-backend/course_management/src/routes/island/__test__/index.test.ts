import request from 'supertest';
import { app } from '../../../app';
import { v4 as uuidv4 } from 'uuid';
import { NotAuthorizedError, NotFoundError } from '@datn242/questify-common';

it('return NotFoundError if course not found', async () => {
  const cookie = await global.getAuthCookie();
  const course_id = uuidv4();
  await request(app)
    .get(`/api/course-mgmt/${course_id}/islands`)
    .set('Cookie', cookie)
    .expect(NotFoundError.statusCode);
});

it('returns a NotAuthorizedError if the user does not own the course', async () => {
  const cookie1 = await global.getAuthCookie('test1@gmail.com');
  const response = await request(app).post('/api/course-mgmt').set('Cookie', cookie1).send({
    name: 'DSA',
  });
  const cookie2 = await global.getAuthCookie('test2@gmail.com');

  await request(app)
    .get(`/api/course-mgmt/${response.body.id}/islands`)
    .set('Cookie', cookie2)
    .expect(NotAuthorizedError.statusCode);
});

it('can fetch a list of islands', async () => {
  const cookie = await global.getAuthCookie();
  const course = await request(app).post('/api/course-mgmt').set('Cookie', cookie).send({
    name: 'dsa',
  });
  await request(app).post(`/api/course-mgmt/${course.body.id}/islands`).set('Cookie', cookie).send({
    name: 'Linked List',
    position: 1,
  });

  await request(app).post(`/api/course-mgmt/${course.body.id}/islands`).set('Cookie', cookie).send({
    name: 'Linked List',
    position: 2,
  });

  await request(app).post(`/api/course-mgmt/${course.body.id}/islands`).set('Cookie', cookie).send({
    name: 'Linked List',
    position: 3,
  });

  const response = await request(app)
    .get(`/api/course-mgmt/${course.body.id}/islands`)
    .set('Cookie', cookie)
    .expect(200);

  expect(response.body.length).toEqual(3);
});
