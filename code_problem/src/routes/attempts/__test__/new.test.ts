import request from 'supertest';
import { app } from '../../../app';
import {
  NotAuthorizedError,
  BadRequestError,
  ResourcePrefix,
  RequestValidationError,
} from '@datn242/questify-common';
import { v4 as uuidv4 } from 'uuid';
import { Attempt } from '../../../models/attempt';

it('can only be accessed if the user is signed in', async () => {
  await request(app)
    .post(`${ResourcePrefix.CodeProblem}/attempts`)
    .send({})
    .expect(NotAuthorizedError.statusCode);
});

it(`returns a status other than ${NotAuthorizedError.statusCode} if the user is signed in`, async () => {
  const cookie = await global.getAuthCookie();
  const response = await request(app)
    .post(`${ResourcePrefix.CodeProblem}/attempts`)
    .set('Cookie', cookie)
    .send({});

  expect(response.status).not.toEqual(NotAuthorizedError.statusCode);
});

it('return NotAuthorizedError if not currentUser', async () => {
  const user_id = uuidv4();
  const cookie = await global.getAuthCookie(user_id);
  const level = await global.createLevel(user_id);

  await request(app)
    .post(`${ResourcePrefix.CodeProblem}/attempts`)
    .set('Cookie', cookie)
    .send({
      student_id: uuidv4(),
      level_id: level.id,
      answer: 'Answer',
    })
    .expect(NotAuthorizedError.statusCode);
});

it('return BadRequestError if level not found', async () => {
  const user_id = uuidv4();
  const cookie = await global.getAuthCookie(user_id);
  const level_id = uuidv4();
  await request(app)
    .post(`${ResourcePrefix.CodeProblem}/attempts`)
    .set('Cookie', cookie)
    .send({
      student_id: user_id,
      level_id: level_id,
      answer: 'Answer',
    })
    .expect((res) => {
      expect(res.status).toEqual(BadRequestError.statusCode);
      expect(res.text).toContain('Level not found');
    });
});

it('returns an error if an invalid attempt is provided', async () => {
  const user_id = uuidv4();
  const cookie = await global.getAuthCookie(user_id);
  const level = await global.createLevel(user_id);

  await request(app)
    .post(`${ResourcePrefix.CodeProblem}/attempts`)
    .set('Cookie', cookie)
    .send({
      student_id: user_id,
      level_id: level.id,
      answer: '',
    })
    .expect((res) => {
      expect(res.status).toEqual(RequestValidationError.statusCode);
      expect(res.text).toContain('answer is required');
    });

  await request(app)
    .post(`${ResourcePrefix.CodeProblem}/attempts`)
    .set('Cookie', cookie)
    .send({
      student_id: '',
      level_id: level.id,
      answer: 'answer',
    })
    .expect((res) => {
      expect(res.status).toEqual(RequestValidationError.statusCode);
      expect(res.text).toContain('student_id must be a valid UUID');
    });

  await request(app)
    .post(`${ResourcePrefix.CodeProblem}/attempts`)
    .set('Cookie', cookie)
    .send({
      student_id: user_id,
      level_id: '',
      answer: 'answer',
    })
    .expect((res) => {
      expect(res.status).toEqual(RequestValidationError.statusCode);
      expect(res.text).toContain('level_id must be a valid UUID');
    });
});

it('creates an attempt with valid inputs', async () => {
  const user_id = uuidv4();
  const cookie = await global.getAuthCookie(user_id);
  const level = await global.createLevel(user_id);

  let attempts = await Attempt.findAll();
  expect(attempts.length).toEqual(0);

  await request(app)
    .post(`${ResourcePrefix.CodeProblem}/attempts`)
    .set('Cookie', cookie)
    .send({
      student_id: user_id,
      level_id: level.id,
      answer: 'New Answer',
    })
    .expect(201);

  attempts = await Attempt.findAll();
  expect(attempts.length).toEqual(1);
  expect(attempts[0].userId).toEqual(user_id);
  expect(attempts[0].levelId).toEqual(level.id);
  expect(attempts[0].answer).toEqual('New Answer');
});
