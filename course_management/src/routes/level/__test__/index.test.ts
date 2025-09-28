import request from 'supertest';
import { app } from '../../../app';
import { v4 as uuidv4 } from 'uuid';
import { NotAuthorizedError, NotFoundError } from '@datn242/questify-common';

it('return NotFoundError if island not found', async () => {
  const cookie = await global.getAuthCookie();
  const island_id = uuidv4();
  await request(app)
    .get(`/api/course-mgmt/islands/${island_id}/levels`)
    .set('Cookie', cookie)
    .expect(NotFoundError.statusCode);
});

it('returns a NotAuthorizedError if the user does not own the course', async () => {
  const cookie1 = await global.getAuthCookie('test1@gmail.com');
  const course = await request(app).post('/api/course-mgmt').set('Cookie', cookie1).send({
    name: 'DSA',
  });
  const island = await request(app)
    .post(`/api/course-mgmt/${course.body.id}/islands`)
    .set('Cookie', cookie1)
    .send({
      name: 'Linked List',
      position: 1,
    });

  const cookie2 = await global.getAuthCookie('test2@gmail.com');

  await request(app)
    .get(`/api/course-mgmt/islands/${island.body.id}/levels`)
    .set('Cookie', cookie2)
    .expect(NotAuthorizedError.statusCode);
});

it('can fetch a list of levels', async () => {
  const cookie = await global.getAuthCookie();
  const course = await request(app).post('/api/course-mgmt').set('Cookie', cookie).send({
    name: 'dsa',
  });
  const island = await request(app)
    .post(`/api/course-mgmt/${course.body.id}/islands`)
    .set('Cookie', cookie)
    .send({
      name: 'Linked List',
      position: 1,
    });

  await request(app)
    .post(`/api/course-mgmt/islands/${island.body.id}/level`)
    .set('Cookie', cookie)
    .send({
      name: 'Longest Substring Without Repeating Characters',
      position: 6,
    })
    .expect(201);

  await request(app)
    .post(`/api/course-mgmt/islands/${island.body.id}/level`)
    .set('Cookie', cookie)
    .send({
      name: 'Longest Substring Without Repeating Characters',
      position: 6,
    })
    .expect(201);
  await request(app)
    .post(`/api/course-mgmt/islands/${island.body.id}/level`)
    .set('Cookie', cookie)
    .send({
      name: 'Longest Substring Without Repeating Characters',
      position: 6,
    })
    .expect(201);

  const response = await request(app)
    .get(`/api/course-mgmt/islands/${island.body.id}/levels`)
    .set('Cookie', cookie)
    .expect(200);

  expect(response.body.length).toEqual(3);
});
