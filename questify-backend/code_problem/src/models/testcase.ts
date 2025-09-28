import { Model, DataTypes, Optional, ModelScopeOptions, ModelValidateOptions } from 'sequelize';
import { sequelize } from '../config/db';
import { CodeProblem } from './code-problem';
import { v4 as uuidv4 } from 'uuid';

const TestcaseDefinition = {
  id: {
    allowNull: false,
    primaryKey: true,
    type: DataTypes.UUID,
    defaultValue: () => uuidv4(),
  },
  codeProblemId: {
    allowNull: false,
    type: DataTypes.UUID,
    references: {
      model: CodeProblem,
      key: 'id',
    },
  },
  input: {
    allowNull: false,
    type: DataTypes.JSONB,
  },
  output: {
    allowNull: false,
    type: DataTypes.JSONB,
  },
  hidden: {
    allowNull: false,
    type: DataTypes.BOOLEAN,
  },
  isDeleted: {
    allowNull: false,
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
};

interface TestcaseAttributes {
  id: string;
  codeProblemId: string;
  input: string;
  output: string;
  hidden: boolean;
  isDeleted: boolean;
}

type TestcaseCreationAttributes = Optional<TestcaseAttributes, 'id' | 'isDeleted'>;

class Testcase
  extends Model<TestcaseAttributes, TestcaseCreationAttributes>
  implements TestcaseAttributes
{
  public id!: string;
  public codeProblemId!: string;
  public input!: string;
  public output!: string;
  public hidden!: boolean;
  public isDeleted!: boolean;

  static readonly scopes: ModelScopeOptions = {};

  static readonly validations: ModelValidateOptions = {};
}

Testcase.init(TestcaseDefinition, {
  sequelize,
  tableName: 'testcases',
  underscored: true,
  createdAt: true,
  updatedAt: true,
  defaultScope: {
    where: {
      isDeleted: false,
    },
  },
  scopes: Testcase.scopes,
  validate: Testcase.validations,
});

export { Testcase };
