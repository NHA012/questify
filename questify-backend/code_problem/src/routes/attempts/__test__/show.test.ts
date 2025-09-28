import request from 'supertest';
import { app } from '../../../app';
import { v4 as uuidv4 } from 'uuid';
import { NotFoundError, ResourcePrefix, NotAuthorizedError } from '@datn242/questify-common';

it('returns a NotFoundError if the attempt is not found', async () => {
  const attempt_id = uuidv4();
  await request(app)
    .get(`${ResourcePrefix.CodeProblem}/attempts/${attempt_id}`)
    .set('Cookie', await global.getAuthCookie())
    .expect(NotFoundError.statusCode);
});

it('returns a NotAuthorizedError if the attempt is not owned by the user', async () => {
  const user_id = uuidv4();
  const cookie = await global.getAuthCookie(user_id);
  const level = await global.createLevel(user_id);

  const attempt = await request(app)
    .post(`${ResourcePrefix.CodeProblem}/attempts`)
    .set('Cookie', cookie)
    .send({
      student_id: user_id,
      level_id: level.id,
      answer: 'New Answer',
    })
    .expect(201);

  const cookie2 = await global.getAuthCookie(undefined, 'test2@gmail.com');

  await request(app)
    .get(`${ResourcePrefix.CodeProblem}/attempts/${attempt.body.id}`)
    .set('Cookie', cookie2)
    .expect(NotAuthorizedError.statusCode);
});

it('returns the attempt if the attempt is found', async () => {
  const user_id = uuidv4();
  const cookie = await global.getAuthCookie(user_id);
  const level = await global.createLevel(user_id);

  const attempt = await request(app)
    .post(`${ResourcePrefix.CodeProblem}/attempts`)
    .set('Cookie', cookie)
    .send({
      student_id: user_id,
      level_id: level.id,
      answer: 'New Answer',
    })
    .expect(201);

  const response = await request(app)
    .get(`${ResourcePrefix.CodeProblem}/attempts/${attempt.body.id}`)
    .set('Cookie', cookie)
    .expect(200);
  expect(response.body.userId).toEqual(user_id);
  expect(response.body.levelId).toEqual(level.id);
  expect(response.body.answer).toEqual('New Answer');
});
