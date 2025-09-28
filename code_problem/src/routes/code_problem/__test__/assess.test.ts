import request from 'supertest';
import { app } from '../../../app';
import { Testcase } from '../../../models/testcase';
import { ResourcePrefix } from '@datn242/questify-common';
import { v4 as uuidv4 } from 'uuid';
import {
  twoSum,
  jumpGame,
  validParentheses,
  searchA2DMatrix,
} from '../../../mock-data/assessment.mock';
import { parseInputString } from '../../../service/assessment.srv';

it.only('check parse of different data types', () => {
  const inputString = 'test = "test string", target = 123';
  const inputNumber = 'test = 123, target = 123';
  const inputBoolean = 'test = true, target = 123';
  const inputUndefined = 'test = undefined, target = 123';
  const inputNull = 'test = null, target = 123';
  const input1DArray = 'test = [1, 2, 3], target = 123';
  const input2DArray = 'test = [[1, 2], [3, 4]], target = 123';
  const inputMixedArray = 'test = [1, "hello", true], target = 123';
  const inputObject = 'test = { a: 1, b: "hello", c: true }, target = 123';
  const inputNestedObject = 'test = { a: { b: 1 }, c: [2, 3], d: true }, target = 123';

  expect(parseInputString(inputString)).toEqual(['test string', 123]);
  expect(parseInputString(inputNumber)).toEqual([123, 123]);
  expect(parseInputString(inputBoolean)).toEqual([true, 123]);
  expect(parseInputString(inputUndefined)).toEqual([undefined, 123]);
  expect(parseInputString(inputNull)).toEqual([null, 123]);
  expect(parseInputString(input1DArray)).toEqual([[1, 2, 3], 123]);
  expect(parseInputString(input2DArray)).toEqual([
    [
      [1, 2],
      [3, 4],
    ],
    123,
  ]);
  expect(parseInputString(inputMixedArray)).toEqual([[1, 'hello', true], 123]);
  expect(parseInputString(inputObject)).toEqual([{ a: 1, b: 'hello', c: true }, 123]);
  expect(parseInputString(inputNestedObject)).toEqual([{ a: { b: 1 }, c: [2, 3], d: true }, 123]);
});

it('assess Two sum problem with valid input', async () => {
  const user_id = uuidv4();
  const cookie = await global.getAuthCookie(user_id);
  const level = await global.createLevel(user_id);

  const code_problem = await request(app)
    .post(ResourcePrefix.CodeProblem)
    .set('Cookie', cookie)
    .send({
      level_id: level.id,
      description: 'Test Description',
      starterCode: 'function test() {}',
    })
    .expect(201);

  const testcases = await Testcase.findAll();
  expect(testcases.length).toEqual(0);

  await request(app)
    .post(`${ResourcePrefix.CodeProblem}/${code_problem.body.id}/testcases`)
    .set('Cookie', cookie)
    .send(twoSum.mockTestcase)
    .expect(201);

  const assessmentResponse = await request(app)
    .post(`${ResourcePrefix.CodeProblem}/${code_problem.body.id}/assessment`)
    .set('Cookie', cookie)
    .send({
      userCode: twoSum.mockUserCode,
    })
    .expect(200);

  expect(assessmentResponse.body.success).toBe(true);
  expect(assessmentResponse.body.totalTestcases).toBe(3);
  expect(assessmentResponse.body.passedTestcases).toBe(3);
});

it('assess Jump Game problem with valid input', async () => {
  const user_id = uuidv4();
  const cookie = await global.getAuthCookie(user_id);
  const level = await global.createLevel(user_id);

  const code_problem = await request(app)
    .post(ResourcePrefix.CodeProblem)
    .set('Cookie', cookie)
    .send({
      level_id: level.id,
      description: 'Test Description',
      starterCode: 'function test() {}',
    })
    .expect(201);

  const testcases = await Testcase.findAll();
  expect(testcases.length).toEqual(0);

  await request(app)
    .post(`${ResourcePrefix.CodeProblem}/${code_problem.body.id}/testcases`)
    .set('Cookie', cookie)
    .send(jumpGame.mockTestcase)
    .expect(201);

  const assessmentResponse = await request(app)
    .post(`${ResourcePrefix.CodeProblem}/${code_problem.body.id}/assessment`)
    .set('Cookie', cookie)
    .send({
      userCode: jumpGame.mockUserCode,
    })
    .expect(200);

  expect(assessmentResponse.body.success).toBe(true);
  expect(assessmentResponse.body.totalTestcases).toBe(2);
  expect(assessmentResponse.body.passedTestcases).toBe(2);
});

it('assess Valid Parenthesis problem with valid input', async () => {
  const user_id = uuidv4();
  const cookie = await global.getAuthCookie(user_id);
  const level = await global.createLevel(user_id);

  const code_problem = await request(app)
    .post(ResourcePrefix.CodeProblem)
    .set('Cookie', cookie)
    .send({
      level_id: level.id,
      description: 'Test Description',
      starterCode: 'function test() {}',
    })
    .expect(201);

  const testcases = await Testcase.findAll();
  expect(testcases.length).toEqual(0);

  await request(app)
    .post(`${ResourcePrefix.CodeProblem}/${code_problem.body.id}/testcases`)
    .set('Cookie', cookie)
    .send(validParentheses.mockTestcase)
    .expect(201);

  const assessmentResponse = await request(app)
    .post(`${ResourcePrefix.CodeProblem}/${code_problem.body.id}/assessment`)
    .set('Cookie', cookie)
    .send({
      userCode: validParentheses.mockUserCode,
    })
    .expect(200);

  expect(assessmentResponse.body.success).toBe(true);
  expect(assessmentResponse.body.totalTestcases).toBe(9);
  expect(assessmentResponse.body.passedTestcases).toBe(9);
});

it('assess Search a 2D Matrx problem with valid input', async () => {
  const user_id = uuidv4();
  const cookie = await global.getAuthCookie(user_id);
  const level = await global.createLevel(user_id);

  const code_problem = await request(app)
    .post(ResourcePrefix.CodeProblem)
    .set('Cookie', cookie)
    .send({
      level_id: level.id,
      description: 'Test Description',
      starterCode: 'function test() {}',
    })
    .expect(201);

  const testcases = await Testcase.findAll();
  expect(testcases.length).toEqual(0);

  await request(app)
    .post(`${ResourcePrefix.CodeProblem}/${code_problem.body.id}/testcases`)
    .set('Cookie', cookie)
    .send(searchA2DMatrix.mockTestcase)
    .expect(201);

  const assessmentResponse = await request(app)
    .post(`${ResourcePrefix.CodeProblem}/${code_problem.body.id}/assessment`)
    .set('Cookie', cookie)
    .send({
      userCode: searchA2DMatrix.mockUserCode,
    })
    .expect(200);

  expect(assessmentResponse.body.success).toBe(true);
  expect(assessmentResponse.body.totalTestcases).toBe(3);
  expect(assessmentResponse.body.passedTestcases).toBe(3);
});
