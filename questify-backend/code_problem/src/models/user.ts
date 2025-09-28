import { Model, DataTypes, Optional, ModelScopeOptions, ModelValidateOptions } from 'sequelize';
import { sequelize } from '../config/db';
import { UserRole, UserStatus } from '@datn242/questify-common';
import { v4 as uuidv4 } from 'uuid';

const UserDefinition = {
  id: {
    allowNull: false,
    primaryKey: true,
    type: DataTypes.UUID,
    defaultValue: () => uuidv4(),
  },
  gmail: {
    allowNull: false,
    type: DataTypes.STRING,
    unique: true,
    validate: {
      isEmail: true,
    },
  },
  role: {
    allowNull: false,
    type: DataTypes.STRING,
    validate: {
      isIn: [[UserRole.Student, UserRole.Teacher, UserRole.Admin]],
    },
  },
  userName: {
    allowNull: false,
    type: DataTypes.STRING,
  },
  status: {
    allowNull: false,
    type: DataTypes.STRING,
    validate: {
      isIn: [[UserStatus.Active, UserStatus.Suspended]],
    },
  },
  isDeleted: {
    allowNull: false,
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
};

interface UserAttributes {
  id: string;
  gmail: string;
  role: UserRole;
  userName: string;
  status: UserStatus;
  isDeleted: boolean;
}

type UserCreationAttributes = Optional<UserAttributes, 'id' | 'isDeleted'>;

class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
  public id!: string;
  public gmail!: string;
  public role!: UserRole;
  public userName!: string;
  public status!: UserStatus;
  public isDeleted!: boolean;

  static readonly scopes: ModelScopeOptions = {};

  static readonly validations: ModelValidateOptions = {};
}

User.init(UserDefinition, {
  sequelize,
  tableName: 'users',
  underscored: true,
  createdAt: true,
  updatedAt: true,
  defaultScope: {
    where: {
      isDeleted: false,
    },
  },
  scopes: User.scopes,
  validate: User.validations,
});

export { User };
