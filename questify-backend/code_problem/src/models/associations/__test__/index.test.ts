import { Attempt } from '../../attempt';
import { CodeProblem } from '../../code-problem';
import { Level } from '../../level';
import { Testcase } from '../../testcase';
import { User } from '../../user';
import { UserLevel } from '../../user-level';

it('check attempt associations', async () => {
  expect(Object.keys(Attempt.associations)).toEqual(['Level', 'User']);
});

it('check code problem associations', async () => {
  expect(Object.keys(CodeProblem.associations)).toEqual(['Level', 'Testcases']);
});

it('check level associations', async () => {
  expect(Object.keys(Level.associations)).toEqual([
    'CodeProblem',
    'students',
    'UserLevels',
    'User',
  ]);
});

it('check testcase associations', async () => {
  expect(Object.keys(Testcase.associations)).toEqual(['CodeProblem']);
});

it('check user level associations', async () => {
  expect(Object.keys(UserLevel.associations)).toEqual(['User', 'Level']);
});

it('check user associations', async () => {
  expect(Object.keys(User.associations)).toEqual(['Attempts', 'levels', 'UserLevels']);
});
