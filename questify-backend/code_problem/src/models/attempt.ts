import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../config/db';
import { Level } from './level';
import { User } from './user';
import { v4 as uuidv4 } from 'uuid';

const AttemptDefinition = {
  id: {
    allowNull: false,
    primaryKey: true,
    type: DataTypes.UUID,
    defaultValue: () => uuidv4(),
  },
  userId: {
    allowNull: false,
    type: DataTypes.UUID,
    references: {
      model: User,
      key: 'id',
    },
  },
  answer: {
    allowNull: true,
    type: DataTypes.JSON,
  },
  gold: {
    allowNull: true,
    type: DataTypes.INTEGER,
    validate: {
      min: 0,
    },
  },
  exp: {
    allowNull: true,
    type: DataTypes.INTEGER,
    validate: {
      min: 0,
    },
  },
  point: {
    allowNull: true,
    type: DataTypes.INTEGER,
    validate: {
      min: 0,
    },
  },
  levelId: {
    allowNull: false,
    type: DataTypes.UUID,
    references: {
      model: Level,
      key: 'id',
    },
  },
  finishedAt: {
    allowNull: true,
    type: DataTypes.DATE,
  },
  createdAt: {
    allowNull: false,
    type: DataTypes.DATE,
    defaultValue: () => Date.now(),
  },
};

interface AttemptAttributes {
  id: string;
  userId: string;
  answer?: object;
  gold?: number;
  exp?: number;
  point?: number;
  levelId: string;
  finishedAt?: Date;
  createdAt: Date;
}

type AttemptCreationAttributes = Optional<AttemptAttributes, 'id' | 'createdAt'>;

class Attempt
  extends Model<AttemptAttributes, AttemptCreationAttributes>
  implements AttemptAttributes
{
  public id!: string;
  public userId!: string;
  public answer?: object;
  public gold?: number;
  public exp?: number;
  public point?: number;
  public levelId!: string;
  public finishedAt?: Date;
  public createdAt!: Date;
}

Attempt.init(AttemptDefinition, {
  sequelize,
  tableName: 'attempts',
  underscored: true,
  createdAt: true,
  updatedAt: true,
});

export { Attempt };
