import { Model, DataTypes, Optional, ModelScopeOptions, ModelValidateOptions } from 'sequelize';
import { sequelize } from '../config/db';
import { Level } from './level';
import { v4 as uuidv4 } from 'uuid';

const CodeProblemDefinition = {
  id: {
    allowNull: false,
    primaryKey: true,
    type: DataTypes.UUID,
    defaultValue: () => uuidv4(),
  },
  levelId: {
    allowNull: false,
    type: DataTypes.UUID,
    references: {
      model: Level,
      key: 'id',
    },
  },
  title: {
    allowNull: false,
    type: DataTypes.STRING,
  },
  description: {
    allowNull: true,
    type: DataTypes.TEXT,
  },
  parameters: {
    allowNull: false,
    type: DataTypes.JSONB,
    defaultValue: [],
  },
  returnType: {
    allowNull: false,
    type: DataTypes.JSONB,
    defaultValue: {},
  },
  starterCode: {
    allowNull: false,
    type: DataTypes.TEXT,
  },

  isDeleted: {
    allowNull: false,
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
};

interface CodeProblemAttributes {
  id: string;
  levelId: string;
  title: string;
  description?: string;
  parameters: string[];
  returnType: Record<string, unknown>;
  starterCode: string;
  isDeleted: boolean;
}

type CodeProblemCreationAttributes = Optional<CodeProblemAttributes, 'id' | 'isDeleted'>;

class CodeProblem
  extends Model<CodeProblemAttributes, CodeProblemCreationAttributes>
  implements CodeProblemAttributes
{
  public id!: string;
  public levelId!: string;
  public title!: string;
  public description?: string;
  public parameters!: string[];
  public returnType!: Record<string, unknown>;
  public starterCode!: string;
  public isDeleted!: boolean;

  static readonly scopes: ModelScopeOptions = {};

  static readonly validations: ModelValidateOptions = {};
}

CodeProblem.init(CodeProblemDefinition, {
  sequelize,
  tableName: 'code_problems',
  underscored: true,
  createdAt: true,
  updatedAt: true,
  defaultScope: {
    where: {
      isDeleted: false,
    },
  },
  scopes: CodeProblem.scopes,
  validate: CodeProblem.validations,
});

export { CodeProblem };
