import request from 'supertest';
import { app } from '../../../app';
import {
  NotAuthorizedError,
  BadRequestError,
  ResourcePrefix,
  RequestValidationError,
} from '@datn242/questify-common';
import { v4 as uuidv4 } from 'uuid';
import { Testcase } from '../../../models/testcase';

it('can only be accessed if the user is signed in', async () => {
  const code_problem_id = uuidv4();
  await request(app)
    .post(`${ResourcePrefix.CodeProblem}/${code_problem_id}/testcases`)
    .send({})
    .expect(NotAuthorizedError.statusCode);
});

it(`returns a status other than ${NotAuthorizedError.statusCode} if the user is signed in`, async () => {
  const cookie = await global.getAuthCookie();
  const code_problem_id = uuidv4();
  const response = await request(app)
    .post(`${ResourcePrefix.CodeProblem}/${code_problem_id}/testcases`)
    .set('Cookie', cookie)
    .send({});

  expect(response.status).not.toEqual(NotAuthorizedError.statusCode);
});

it('return BadRequestError if code problem not found', async () => {
  const cookie = await global.getAuthCookie();
  const code_problem_id = uuidv4();
  await request(app)
    .post(`${ResourcePrefix.CodeProblem}/${code_problem_id}/testcases`)
    .set('Cookie', cookie)
    .send({
      testcases: [
        {
          input: '1',
          output: '2',
          hidden: true,
        },
      ],
    })
    .expect((res) => {
      expect(res.status).toEqual(BadRequestError.statusCode);
      expect(res.text).toContain('Code Problem not found');
    });
});

it('returns an error if the user does not own the code problem', async () => {
  const user_id = uuidv4();
  const cookie = await global.getAuthCookie(user_id);
  const level = await global.createLevel(user_id);

  const code_problem = await request(app)
    .post(ResourcePrefix.CodeProblem)
    .set('Cookie', cookie)
    .send({
      level_id: level.id,
      title: 'Test Title',
      description: 'Test Description',
      starterCode: 'function test() {}',
    })
    .expect(201);

  const cookie2 = await global.getAuthCookie(undefined, 'test2@gmail.com');
  await request(app)
    .post(`${ResourcePrefix.CodeProblem}/${code_problem.body.id}/testcases`)
    .set('Cookie', cookie2)
    .send({
      testcases: [
        {
          input: '1',
          output: '2',
          hidden: true,
        },
      ],
    })
    .expect(NotAuthorizedError.statusCode);
});

it('returns an error if an invalid testcases is provided', async () => {
  const user_id = uuidv4();
  const cookie = await global.getAuthCookie(user_id);
  const level = await global.createLevel(user_id);

  const code_problem = await request(app)
    .post(ResourcePrefix.CodeProblem)
    .set('Cookie', cookie)
    .send({
      level_id: level.id,
      title: 'Test Title',
      description: 'Test Description',
      starterCode: 'Test StarterCode',
    })
    .expect(201);

  await request(app)
    .post(`${ResourcePrefix.CodeProblem}/${code_problem.body.id}/testcases`)
    .set('Cookie', cookie)
    .send({
      testcases: [],
    })
    .expect((res) => {
      expect(res.status).toEqual(RequestValidationError.statusCode);
      expect(res.text).toContain('testcases must be a non-empty array');
    });
});

it('creates an testcase with valid inputs', async () => {
  const user_id = uuidv4();
  const cookie = await global.getAuthCookie(user_id);
  const level = await global.createLevel(user_id);

  const code_problem = await request(app)
    .post(ResourcePrefix.CodeProblem)
    .set('Cookie', cookie)
    .send({
      level_id: level.id,
      title: 'Test Title',
      description: 'Test Description',
      starterCode: 'Test StarterCode',
    })
    .expect(201);

  let testcases = await Testcase.findAll();
  expect(testcases.length).toEqual(0);

  await request(app)
    .post(`${ResourcePrefix.CodeProblem}/${code_problem.body.id}/testcases`)
    .set('Cookie', cookie)
    .send({
      testcases: [
        {
          input: '1',
          output: '2',
          hidden: true,
        },
        {
          input: '0',
          output: '1',
          hidden: false,
        },
      ],
    })
    .expect(201);

  testcases = await Testcase.findAll();
  expect(testcases.length).toEqual(2);
  expect(testcases[0].input).toEqual('1');
  expect(testcases[0].output).toEqual('2');
  expect(testcases[0].hidden).toEqual(true);
  expect(testcases[1].input).toEqual('0');
  expect(testcases[1].output).toEqual('1');
  expect(testcases[1].hidden).toEqual(false);
});
