import request from 'supertest';
import { app } from '../../../app';
import { v4 as uuidv4 } from 'uuid';
import { NotFoundError, ResourcePrefix } from '@datn242/questify-common';

it('returns a NotFoundError if the code problem is not found', async () => {
  const code_problem_id = uuidv4();
  await request(app)
    .get(`${ResourcePrefix.CodeProblem}/${code_problem_id}`)
    .expect(NotFoundError.statusCode);
});

it('returns the code problem if the code problem is found', async () => {
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
    .get(`${ResourcePrefix.CodeProblem}/${code_problem.body.id}`)
    .expect(200);
  expect(response.body.levelId).toEqual(level.id);
  expect(response.body.description).toEqual('Test Description');
});
