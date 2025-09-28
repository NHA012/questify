import request from 'supertest';
import { app } from '../../../app';
import { v4 as uuidv4 } from 'uuid';
import { NotFoundError, ResourcePrefix } from '@datn242/questify-common';

it('returns NotFoundError if the student is not found', async () => {
  const student_id = uuidv4();
  const user_id = uuidv4();
  const cookie = await global.getAuthCookie(user_id);
  const level_id = uuidv4();

  await request(app)
    .get(`${ResourcePrefix.CodeProblem}/attempts/${student_id}/${level_id}`)
    .set('Cookie', cookie)
    .expect(NotFoundError.statusCode);
});

it('returns NotFoundError if the level is not found', async () => {
  const user_id = uuidv4();
  const cookie = await global.getAuthCookie(user_id);
  const level_id = uuidv4();

  await request(app)
    .get(`${ResourcePrefix.CodeProblem}/attempts/${user_id}/${level_id}`)
    .set('Cookie', cookie)
    .expect(NotFoundError.statusCode);
});

it('returns the attempt if the attempt is found', async () => {
  const user_id = uuidv4();
  const cookie = await global.getAuthCookie(user_id);
  const level = await global.createLevel(user_id);

  let response = await request(app)
    .get(`${ResourcePrefix.CodeProblem}/attempts/${user_id}/${level.id}`)
    .set('Cookie', cookie)
    .expect(200);

  expect(response.body.length).toEqual(0);

  await request(app)
    .post(`${ResourcePrefix.CodeProblem}/attempts`)
    .set('Cookie', cookie)
    .send({
      student_id: user_id,
      level_id: level.id,
      answer: 'First Answer',
    })
    .expect(201);

  await request(app)
    .post(`${ResourcePrefix.CodeProblem}/attempts`)
    .set('Cookie', cookie)
    .send({
      student_id: user_id,
      level_id: level.id,
      answer: 'Second Answer',
    })
    .expect(201);

  response = await request(app)
    .get(`${ResourcePrefix.CodeProblem}/attempts/${user_id}/${level.id}`)
    .set('Cookie', cookie)
    .expect(200);
  expect(response.body.length).toEqual(2);
  expect(response.body[0].answer).toEqual('First Answer');
  expect(response.body[1].answer).toEqual('Second Answer');
});
