import request from 'supertest';
import { app } from '../../../app';
import { v4 as uuidv4 } from 'uuid';
import { NotFoundError } from '@datn242/questify-common';

it('returns a NotFoundError if the course is not found', async () => {
  const course_id = uuidv4();
  const island_id = uuidv4();
  await request(app)
    .get(`/api/course-mgmt/${course_id}/islands/${island_id}`)
    .send()
    .expect(NotFoundError.statusCode);
});

it('returns a NotFoundError if the island is not found', async () => {
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
    .get(`/api/course-mgmt/${courseRes.body.id}/islands/${island_id}`)
    .send()
    .expect(NotFoundError.statusCode);
});

it('returns the island if the island is found', async () => {
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
    .get(`/api/course-mgmt/${courseRes.body.id}/islands/${islandRes.body.id}`)
    .send()
    .expect(200);
  expect(response.body.name).toEqual('Linked List');
  expect(response.body.position).toEqual(0);
});
