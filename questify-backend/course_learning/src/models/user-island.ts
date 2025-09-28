import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../config/db';
import { User } from './user';
import { Island } from './island';
import { v4 as uuidv4 } from 'uuid';
import { CompletionStatus } from '@datn242/questify-common';

const UserIslandDefinition = {
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
  islandId: {
    allowNull: false,
    type: DataTypes.UUID,
    references: {
      model: Island,
      key: 'id',
    },
  },
  point: {
    allowNull: false,
    type: DataTypes.INTEGER,
    defaultValue: 0,
    validate: {
      min: 0,
    },
  },
  completionStatus: {
    allowNull: false,
    type: DataTypes.ENUM(
      CompletionStatus.InProgress,
      CompletionStatus.Completed,
      CompletionStatus.Fail,
      CompletionStatus.Locked,
    ),
    defaultValue: CompletionStatus.InProgress,
  },
  finishedDate: {
    allowNull: true,
    type: DataTypes.DATE,
  },
};

interface UserIslandAttributes {
  id: string;
  userId: string;
  islandId: string;
  point: number;
  completionStatus: CompletionStatus;
  finishedDate?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

type UserIslandCreationAttributes = Optional<UserIslandAttributes, 'id'>;
class UserIsland
  extends Model<UserIslandAttributes, UserIslandCreationAttributes>
  implements UserIslandAttributes
{
  public id!: string;
  public userId!: string;
  public islandId!: string;
  public point!: number;
  public completionStatus!: CompletionStatus;
  public finishedDate?: Date;
  public createdAt?: Date;
  public updatedAt?: Date;
}

UserIsland.init(UserIslandDefinition, {
  sequelize,
  tableName: 'user-islands',
  underscored: true,
  createdAt: true,
  updatedAt: true,
});

export { UserIsland };
