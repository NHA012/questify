import request from 'supertest';
import { app } from '../../../app';
import { CodeProblem } from '../../../models/code-problem';
import {
  NotAuthorizedError,
  BadRequestError,
  ResourcePrefix,
  RequestValidationError,
} from '@datn242/questify-common';
import { v4 as uuidv4 } from 'uuid';

it('can only be accessed if the user is signed in', async () => {
  await request(app)
    .post(ResourcePrefix.CodeProblem)
    .send({})
    .expect(NotAuthorizedError.statusCode);
});

it(`returns a status other than ${NotAuthorizedError.statusCode} if the user is signed in`, async () => {
  const cookie = await global.getAuthCookie();
  const response = await request(app)
    .post(ResourcePrefix.CodeProblem)
    .set('Cookie', cookie)
    .send({});

  expect(response.status).not.toEqual(NotAuthorizedError.statusCode);
});

it('return BadRequestError if level not found', async () => {
  const cookie = await global.getAuthCookie();
  const level_id = uuidv4();
  await request(app)
    .post(ResourcePrefix.CodeProblem)
    .set('Cookie', cookie)
    .send({
      level_id: level_id,
      title: 'Test title',
      description: 'Test description',
      starterCode: 'function test() {}',
    })
    .expect((res) => {
      expect(res.status).toEqual(BadRequestError.statusCode);
      expect(res.text).toContain('Level not found');
    });
});

it('returns an error if the user does not have permission to create a code problem', async () => {
  const user_id = uuidv4();
  await global.getAuthCookie(user_id);
  const level = await global.createLevel(user_id);

  const cookie2 = await global.getAuthCookie(undefined, 'test2@gmail.com');
  await request(app)
    .post(ResourcePrefix.CodeProblem)
    .set('Cookie', cookie2)
    .send({
      level_id: level.id,
      title: 'Test title',
      description: 'Test description',
      starterCode: 'function test() {}',
    })
    .expect(NotAuthorizedError.statusCode);
});

it('returns an error if an invalid description is provided', async () => {
  const user_id = uuidv4();
  const cookie = await global.getAuthCookie(user_id);
  const level = await global.createLevel(user_id);

  await request(app)
    .post(ResourcePrefix.CodeProblem)
    .set('Cookie', cookie)
    .send({
      level_id: '',
      title: 'Test title',
      description: 'Test description',
    })
    .expect((res) => {
      expect(res.status).toEqual(RequestValidationError.statusCode);
      expect(res.text).toContain('level_id must be a valid UUID');
    });

  await request(app)
    .post(ResourcePrefix.CodeProblem)
    .set('Cookie', cookie)
    .send({
      level_id: level.id,
      title: 'Test title',
      description: 1,
    })
    .expect((res) => {
      expect(res.status).toEqual(RequestValidationError.statusCode);
      expect(res.text).toContain('description must be a string');
    });

  await request(app)
    .post(ResourcePrefix.CodeProblem)
    .set('Cookie', cookie)
    .send({
      level_id: level.id,
      title: 'Test title',
      description: true,
    })
    .expect((res) => {
      expect(res.status).toEqual(RequestValidationError.statusCode);
      expect(res.text).toContain('description must be a string');
    });
});

it('creates an Island with valid inputs', async () => {
  const user_id = uuidv4();
  const cookie = await global.getAuthCookie(user_id);
  const level = await global.createLevel(user_id);
  let code_problems = await CodeProblem.findAll();
  expect(code_problems.length).toEqual(0);

  await request(app)
    .post(ResourcePrefix.CodeProblem)
    .set('Cookie', cookie)
    .send({
      level_id: level.id,
      title: 'Test title',
      description: 'Test description',
      starterCode: 'function test() {}',
    })
    .expect(201);

  code_problems = await CodeProblem.findAll();
  expect(code_problems.length).toEqual(1);
  expect(code_problems[0].levelId).toEqual(level.id);
  expect(code_problems[0].description).toEqual('Test description');
});
