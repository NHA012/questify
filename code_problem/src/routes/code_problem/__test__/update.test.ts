import request from 'supertest';
import { app } from '../../../app';
import { v4 as uuidv4 } from 'uuid';
import {
  RequestValidationError,
  NotFoundError,
  NotAuthorizedError,
  ResourcePrefix,
} from '@datn242/questify-common';

it('returns a NotAuthorizedError if the user is not signin', async () => {
  const code_problem_id = uuidv4();
  await request(app)
    .patch(`${ResourcePrefix.CodeProblem}/${code_problem_id}`)
    .expect(NotAuthorizedError.statusCode);
});

it('returns a NotFoundError if the provided code_problem_id does not exist', async () => {
  const cookie = await global.getAuthCookie();
  const code_problem_id = uuidv4();
  await request(app)
    .patch(`${ResourcePrefix.CodeProblem}/${code_problem_id}`)
    .set('Cookie', cookie)
    .send({
      description: '',
    })
    .expect(NotFoundError.statusCode);
});

it('returns a NotAuthorizedError if the user does not own the code problem', async () => {
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

  const cookie2 = await global.getAuthCookie(undefined, 'test2@gmail.com');
  await request(app)
    .patch(`${ResourcePrefix.CodeProblem}/${code_problem.body.id}`)
    .set('Cookie', cookie2)
    .send({
      description: 'New Description',
    })
    .expect(NotAuthorizedError.statusCode);
});

it('returns a RequestValidationError if the user provides an invalid description', async () => {
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
    .patch(`${ResourcePrefix.CodeProblem}/${code_problem.body.id}`)
    .set('Cookie', cookie)
    .send({
      description: 1,
    })
    .expect((res) => {
      expect(res.status).toEqual(RequestValidationError.statusCode);
      expect(res.text).toContain('description must be a string');
    });

  await request(app)
    .patch(`${ResourcePrefix.CodeProblem}/${code_problem.body.id}`)
    .set('Cookie', cookie)
    .send({
      description: true,
    })
    .expect((res) => {
      expect(res.status).toEqual(RequestValidationError.statusCode);
      expect(res.text).toContain('description must be a string');
    });
});

it('updates the code problem provided valid inpatchs', async () => {
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

  const response = await request(app)
    .patch(`${ResourcePrefix.CodeProblem}/${code_problem.body.id}`)
    .set('Cookie', cookie)
    .send({
      description: 'New Description',
    })
    .expect(201);

  expect(response.body.description).toEqual('New Description');
});
