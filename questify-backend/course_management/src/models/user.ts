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
  role: {
    allowNull: false,
    type: DataTypes.STRING,
    validate: {
      isIn: [[UserRole.Student, UserRole.Teacher, UserRole.Admin]],
    },
  },
  status: {
    allowNull: false,
    type: DataTypes.STRING,
    validate: {
      isIn: [Object.values(UserStatus)],
    },
  },
};

interface UserAttributes {
  id: string;
  role: UserRole;
  status: UserStatus;
}

type UserCreationAttributes = Optional<UserAttributes, 'id' | 'status' | 'role'>;

class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
  public id!: string;
  public role!: UserRole;
  public status!: UserStatus;

  static readonly scopes: ModelScopeOptions = {};

  static readonly validations: ModelValidateOptions = {};
}

User.init(UserDefinition, {
  sequelize,
  tableName: 'users',
  underscored: true,
  createdAt: true,
  updatedAt: true,
  scopes: User.scopes,
  validate: User.validations,
});

export { User };
