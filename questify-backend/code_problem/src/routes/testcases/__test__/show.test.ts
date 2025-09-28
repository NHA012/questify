import request from 'supertest';
import { app } from '../../../app';
import { v4 as uuidv4 } from 'uuid';
import { NotFoundError, ResourcePrefix } from '@datn242/questify-common';

it('returns a NotFoundError if the testcase is not found', async () => {
  const code_problem_id = uuidv4();
  const testcase_id = uuidv4();
  await request(app)
    .get(`${ResourcePrefix.CodeProblem}/${code_problem_id}/testcases/${testcase_id}`)
    .expect(NotFoundError.statusCode);
});

it('returns the testcase if the testcase is found', async () => {
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

  const testcases = await request(app)
    .post(`${ResourcePrefix.CodeProblem}/${code_problem.body.id}/testcases`)
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
    .expect(201);

  const response = await request(app)
    .get(`${ResourcePrefix.CodeProblem}/${code_problem.body.id}/testcases/${testcases.body[0].id}`)
    .expect(200);
  expect(response.body.input).toEqual('1');
  expect(response.body.output).toEqual('2');
  expect(response.body.hidden).toEqual(true);
});
