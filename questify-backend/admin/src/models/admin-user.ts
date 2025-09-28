import { Model, DataTypes, Optional, ModelScopeOptions, ModelValidateOptions } from 'sequelize';
import { sequelize } from '../config/db';
import { User } from './user';
import { v4 as uuidv4 } from 'uuid';

export enum AdminActionType {
  Suspend = 'suspend',
  Unsuspend = 'unsuspend',
}

const AdminUserDefinition = {
  id: {
    allowNull: false,
    primaryKey: true,
    type: DataTypes.UUID,
    defaultValue: () => uuidv4(),
  },
  adminId: {
    allowNull: false,
    type: DataTypes.UUID,
    references: {
      model: User,
      key: 'id',
    },
  },
  userId: {
    allowNull: false,
    type: DataTypes.UUID,
    references: {
      model: User,
      key: 'id',
    },
  },
  reason: {
    allowNull: true,
    type: DataTypes.STRING,
  },
  actionType: {
    allowNull: false,
    type: DataTypes.ENUM,
    values: Object.values(AdminActionType),
  },
};

interface AdminUserAttributes {
  id: string;
  adminId: string;
  userId: string;
  reason?: string;
  actionType: AdminActionType;
}

type AdminUserCreationAttributes = Optional<AdminUserAttributes, 'id'>;

class AdminUser
  extends Model<AdminUserAttributes, AdminUserCreationAttributes>
  implements AdminUserAttributes
{
  public id!: string;
  public adminId!: string;
  public userId!: string;
  public reason?: string;
  public actionType!: AdminActionType;

  static readonly scopes: ModelScopeOptions = {};
  static readonly validations: ModelValidateOptions = {};
}

AdminUser.init(AdminUserDefinition, {
  sequelize,
  tableName: 'admin_user_actions',
  underscored: true,
  createdAt: true,
  updatedAt: false,
  scopes: AdminUser.scopes,
  validate: AdminUser.validations,
  indexes: [
    {
      fields: ['action_type'],
    },
    {
      fields: ['admin_id'],
    },
    {
      fields: ['user_id'],
    },
  ],
});

export { AdminUser };
