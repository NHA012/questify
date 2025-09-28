import { Model, DataTypes, Optional, ModelScopeOptions, ModelValidateOptions } from 'sequelize';
import { sequelize } from '../config/db';
import { v4 as uuidv4 } from 'uuid';
import { User } from './user';

const LevelDefinition = {
  id: {
    allowNull: false,
    primaryKey: true,
    type: DataTypes.UUID,
    defaultValue: () => uuidv4(),
  },
  teacherId: {
    allowNull: false,
    type: DataTypes.UUID,
    references: {
      model: User,
      key: 'id',
    },
  },
  isDeleted: {
    allowNull: false,
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
};

interface LevelAttributes {
  id: string;
  teacherId: string;
  isDeleted: boolean;
}

type LevelCreationAttributes = Optional<LevelAttributes, 'id' | 'isDeleted'>;

class Level extends Model<LevelAttributes, LevelCreationAttributes> implements LevelAttributes {
  public id!: string;
  public teacherId!: string;
  public isDeleted!: boolean;

  static readonly scopes: ModelScopeOptions = {};

  static readonly validations: ModelValidateOptions = {};
}

Level.init(LevelDefinition, {
  sequelize,
  tableName: 'levels',
  underscored: true,
  createdAt: true,
  updatedAt: true,
  defaultScope: {
    where: {
      isDeleted: false,
    },
  },
  scopes: Level.scopes,
  validate: Level.validations,
});

export { Level };
