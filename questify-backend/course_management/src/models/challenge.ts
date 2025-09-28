import { Model, DataTypes, Optional, ModelScopeOptions, ModelValidateOptions } from 'sequelize';
import { sequelize } from '../config/db';
import { v4 as uuidv4 } from 'uuid';
import { Level } from './level';

const ChallengeDefinition = {
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
  isDeleted: {
    allowNull: false,
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
};

interface ChallengeAttributes {
  id: string;
  levelId: string;
  isDeleted: boolean;
}

type ChallengeCreationAttributes = Optional<ChallengeAttributes, 'id' | 'isDeleted'>;

class Challenge
  extends Model<ChallengeAttributes, ChallengeCreationAttributes>
  implements ChallengeAttributes
{
  public id!: string;
  public levelId!: string;
  public isDeleted!: boolean;

  public Level?: Level;

  static readonly scopes: ModelScopeOptions = {};

  static readonly validations: ModelValidateOptions = {};
}

Challenge.init(ChallengeDefinition, {
  sequelize,
  tableName: 'challenges',
  underscored: true,
  createdAt: true,
  updatedAt: true,
  defaultScope: {
    where: {
      isDeleted: false,
    },
  },
  scopes: Challenge.scopes,
  validate: Challenge.validations,
});

export { Challenge };
