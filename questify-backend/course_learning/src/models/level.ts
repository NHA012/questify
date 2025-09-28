import { Model, DataTypes, Optional, ModelScopeOptions, ModelValidateOptions } from 'sequelize';
import { sequelize } from '../config/db';
import { Island } from './island';
import { v4 as uuidv4 } from 'uuid';
import type { User } from './user';
import { Challenge } from './challenge';
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
};

interface LevelAttributes {
  id: string;
  name: string;
  description?: string;
  position: number;
  contentType?: LevelContent;
  islandId: string;
}

type LevelCreationAttributes = Optional<LevelAttributes, 'id'>;

class Level extends Model<LevelAttributes, LevelCreationAttributes> implements LevelAttributes {
  public id!: string;
  public name!: string;
  public description?: string;
  public position!: number;
  public contentType?: LevelContent;
  public islandId!: string;

  public readonly Island?: Island;

  public getIsland!: () => Promise<Island>;

  static readonly scopes: ModelScopeOptions = {};

  static readonly validations: ModelValidateOptions = {};

  declare addUser: (user: User) => Promise<void>;
  declare getUsers: () => Promise<User[]>;

  declare addChallenge: (challenge: Challenge) => Promise<void>;
  declare getChallenge: () => Promise<Challenge>;
}

Level.init(LevelDefinition, {
  sequelize,
  tableName: 'levels',
  underscored: true,
  createdAt: true,
  updatedAt: true,
  scopes: Level.scopes,
  validate: Level.validations,
});

export { Level };
