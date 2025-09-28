import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../config/db';
import { Level } from './level';
import { User } from './user';
import { CompletionStatus } from '@datn242/questify-common';

const UserLevelDefinition = {
  studentId: {
    allowNull: false,
    type: DataTypes.UUID,
    references: {
      model: User,
      key: 'id',
    },
  },
  completionStatus: {
    allowNull: false,
    type: DataTypes.STRING,
    validate: {
      isIn: [[CompletionStatus.Completed, CompletionStatus.Fail, CompletionStatus.InProgress]],
    },
  },
  point: {
    allowNull: true,
    type: DataTypes.INTEGER,
    validate: {
      min: 0,
    },
  },
  finish_date: {
    allowNull: true,
    type: DataTypes.DATE,
  },
  levelId: {
    allowNull: false,
    type: DataTypes.UUID,
    references: {
      model: Level,
      key: 'id',
    },
  },
};

interface UserLevelAttributes {
  studentId: string;
  completionStatus: CompletionStatus;
  point?: number;
  finish_date: Date | null;
  levelId: string;
}

type UserLevelCreationAttributes = Optional<UserLevelAttributes, 'finish_date'>;

class UserLevel
  extends Model<UserLevelAttributes, UserLevelCreationAttributes>
  implements UserLevelAttributes
{
  public studentId!: string;
  public completionStatus!: CompletionStatus;
  public point?: number;
  public finish_date!: Date | null;
  public levelId!: string;
}

UserLevel.init(UserLevelDefinition, {
  sequelize,
  tableName: 'user_level',
  underscored: true,
  createdAt: true,
  updatedAt: true,
});

export { UserLevel };
