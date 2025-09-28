import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../config/db';
import { Course } from './course';
import { Island } from './island';
import { Level } from './level';
import type { User } from './user';
import { v4 as uuidv4 } from 'uuid';

const RewardDefinition = {
  id: {
    allowNull: false,
    primaryKey: true,
    type: DataTypes.UUID,
    defaultValue: () => uuidv4(),
  },
  description: {
    allowNull: true,
    type: DataTypes.STRING,
  },
  requirement: {
    allowNull: true,
    type: DataTypes.STRING,
  },
  rewardTarget: {
    allowNull: false,
    type: DataTypes.ENUM('course', 'island', 'level'),
    validate: {
      notEmpty: true,
      isIn: [['course', 'island', 'level']],
    },
  },
  courseId: {
    allowNull: true,
    type: DataTypes.UUID,
    references: {
      model: Course,
      key: 'id',
    },
  },
  islandId: {
    allowNull: true,
    type: DataTypes.UUID,
    references: {
      model: Island,
      key: 'id',
    },
  },
  levelId: {
    allowNull: true,
    type: DataTypes.UUID,
    references: {
      model: Level,
      key: 'id',
    },
  },
};

interface RewardAttributes {
  id: string;
  description?: string;
  requirement?: string;
  rewardTarget: 'course' | 'island' | 'level';
  courseId?: string;
  islandId?: string;
  levelId?: string;
}

type RewardCreationAttributes = Optional<RewardAttributes, 'id'>;

class Reward extends Model<RewardAttributes, RewardCreationAttributes> implements RewardAttributes {
  public id!: string;
  public description?: string;
  public requirement?: string;
  public rewardTarget!: 'course' | 'island' | 'level';
  public courseId?: string;
  public islandId?: string;
  public levelId?: string;

  declare addUser: (user: User) => Promise<void>;
  declare getUsers: () => Promise<User[]>;
}

Reward.init(RewardDefinition, {
  sequelize,
  tableName: 'rewards',
  underscored: true,
  createdAt: true,
  updatedAt: true,
});

export { Reward };
