import request from 'supertest';
import { app } from '../../../app';
import { v4 as uuidv4 } from 'uuid';
import {
  RequestValidationError,
  NotFoundError,
  NotAuthorizedError,
} from '@datn242/questify-common';

it('returns a NotAuthorizedError if the user is not signin', async () => {
  const level_id = uuidv4();
  const island_id = uuidv4();
  await request(app)
    .patch(`/api/course-mgmt/islands/${island_id}/level/${level_id}`)
    .send()
    .expect(NotAuthorizedError.statusCode);
});

it('returns a NotFoundError if the provided island_id does not exist', async () => {
  const cookie = await global.getAuthCookie();
  const level_id = uuidv4();
  const island_id = uuidv4();
  await request(app)
    .patch(`/api/course-mgmt/islands/${island_id}/level/${level_id}`)
    .set('Cookie', cookie)
    .send()
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
  const level_id = uuidv4();
  await request(app)
    .patch(`/api/course-mgmt/islands/${island.body.id}/level/${level_id}`)
    .set('Cookie', cookie2)
    .send({
      name: 'Computer Architecture',
    })
    .expect(NotAuthorizedError.statusCode);
});

it('returns a NotFoundError if the provided level_id does not exist', async () => {
  const cookie = await global.getAuthCookie('test1@gmail.com');
  const course = await request(app).post('/api/course-mgmt').set('Cookie', cookie).send({
    name: 'DSA',
  });
  const island = await request(app)
    .post(`/api/course-mgmt/${course.body.id}/islands`)
    .set('Cookie', cookie)
    .send({
      name: 'Linked List',
      position: 1,
    });
  const level_id = uuidv4();
  await request(app)
    .patch(`/api/course-mgmt/islands/${island.body.id}/level/${level_id}`)
    .set('Cookie', cookie)
    .send()
    .expect(NotFoundError.statusCode);
});

it('returns a RequestValidationError if the user provides an invalid position or name', async () => {
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

  const level = await request(app)
    .post(`/api/course-mgmt/islands/${island.body.id}/level`)
    .set('Cookie', cookie)
    .send({
      name: 'Longest Substring Without Repeating Characters',
      position: 1,
    })
    .expect(201);

  await request(app)
    .patch(`/api/course-mgmt/islands/${island.body.id}/level/${level.body.id}`)
    .set('Cookie', cookie)
    .send({
      name: 1,
    })
    .expect((res) => {
      expect(res.status).toEqual(RequestValidationError.statusCode);
      expect(res.text).toContain('Name must be a string');
    });

  await request(app)
    .patch(`/api/course-mgmt/islands/${island.body.id}/level/${level.body.id}`)
    .set('Cookie', cookie)
    .send({
      description: 1,
    })
    .expect((res) => {
      expect(res.status).toEqual(RequestValidationError.statusCode);
      expect(res.text).toContain('Description must be a string');
    });

  await request(app)
    .patch(`/api/course-mgmt/islands/${island.body.id}/level/${level.body.id}`)
    .set('Cookie', cookie)
    .send({
      position: 'pos',
    })
    .expect((res) => {
      expect(res.status).toEqual(RequestValidationError.statusCode);
      expect(res.text).toContain('Position must be a number');
    });
});

it('updates the course provided valid inputs', async () => {
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

  const level = await request(app)
    .post(`/api/course-mgmt/islands/${island.body.id}/level`)
    .set('Cookie', cookie)
    .send({
      name: 'Longest Substring Without Repeating Characters',
      position: 1,
    })
    .expect(201);

  const response = await request(app)
    .patch(`/api/course-mgmt/islands/${island.body.id}/level/${level.body.id}`)
    .set('Cookie', cookie)
    .send({
      name: 'New name',
      description: 'New description',
      position: 999,
    })
    .expect(200);

  expect(response.body.name).toEqual('New name');
  expect(response.body.description).toEqual('New description');
  expect(response.body.position).toEqual(999);
});
