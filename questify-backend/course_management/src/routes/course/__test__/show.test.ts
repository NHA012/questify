import request from 'supertest';
import { app } from '../../../app';
import { v4 as uuidv4 } from 'uuid';
import { NotFoundError } from '@datn242/questify-common';

it('returns a 404 if the course is not found', async () => {
  const course_id = uuidv4();

  await request(app).get(`/api/course-mgmt/${course_id}`).send().expect(NotFoundError.statusCode);
});

it('returns the course if the course is found', async () => {
  const name = 'DSA';
  const cookie = await global.getAuthCookie();

  const response = await request(app)
    .post('/api/course-mgmt')
    .set('Cookie', cookie)
    .send({
      name: name,
    })
    .expect(201);

  const courseResponse = await request(app)
    .get(`/api/course-mgmt/course/${response.body.id}`)
    .send()
    .expect(200);
  expect(courseResponse.body.name).toEqual(name);
});
