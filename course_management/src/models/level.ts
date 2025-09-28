import { Model, DataTypes, Optional, ModelScopeOptions, ModelValidateOptions } from 'sequelize';
import { sequelize } from '../config/db';
import { Island } from './island';
import { v4 as uuidv4 } from 'uuid';
import { LevelContent } from '@datn242/questify-common';

const LevelDefinition = {
  id: {
    allowNull: false,
    primaryKey: true,
    type: DataTypes.UUID,
    defaultValue: () => uuidv4(),
  },
  name: {
    allowNull: false,
    type: DataTypes.STRING,
    validate: {
      notEmpty: true,
    },
  },
  description: {
    allowNull: true,
    type: DataTypes.STRING,
  },
  position: {
    allowNull: false,
    type: DataTypes.INTEGER,
  },
  contentType: {
    allowNull: true,
    type: DataTypes.STRING,
    validate: {
      isIn: [Object.values(LevelContent)],
    },
  },
  islandId: {
    allowNull: false,
    type: DataTypes.UUID,
    references: {
      model: Island,
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
  name: string;
  description?: string;
  position: number;
  contentType?: LevelContent;
  islandId: string;
  isDeleted: boolean;
}

type LevelCreationAttributes = Optional<LevelAttributes, 'id' | 'isDeleted'>;

class Level extends Model<LevelAttributes, LevelCreationAttributes> implements LevelAttributes {
  public id!: string;
  public name!: string;
  public description?: string;
  public position!: number;
  public contentType?: LevelContent;
  public islandId!: string;
  public isDeleted!: boolean;

  public Island?: Island;

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
