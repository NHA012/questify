import { Model, DataTypes, Optional, ModelScopeOptions, ModelValidateOptions } from 'sequelize';
import { sequelize } from '../config/db';
import { User } from './user';
import { IslandTemplate } from './island-template';
import { v4 as uuidv4 } from 'uuid';

export enum AdminIslandTemplateActionType {
  Add = 'add',
  Remove = 'remove',
}

const AdminIslandTemplateDefinition = {
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
  islandTemplateId: {
    allowNull: false,
    type: DataTypes.UUID,
    references: {
      model: IslandTemplate,
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
    values: Object.values(AdminIslandTemplateActionType),
  },
};

interface AdminIslandTemplateAttributes {
  id: string;
  adminId: string;
  islandTemplateId: string;
  reason?: string;
  actionType: AdminIslandTemplateActionType;
}

type AdminIslandTemplateCreationAttributes = Optional<AdminIslandTemplateAttributes, 'id'>;

class AdminIslandTemplate
  extends Model<AdminIslandTemplateAttributes, AdminIslandTemplateCreationAttributes>
  implements AdminIslandTemplateAttributes
{
  public id!: string;
  public adminId!: string;
  public islandTemplateId!: string;
  public reason?: string;
  public actionType!: AdminIslandTemplateActionType;

  static readonly scopes: ModelScopeOptions = {};
  static readonly validations: ModelValidateOptions = {};
}

AdminIslandTemplate.init(AdminIslandTemplateDefinition, {
  sequelize,
  tableName: 'admin_island_template_actions',
  underscored: true,
  createdAt: true,
  updatedAt: false,
  scopes: AdminIslandTemplate.scopes,
  validate: AdminIslandTemplate.validations,
  indexes: [
    {
      fields: ['action_type'],
    },
    {
      fields: ['admin_id'],
    },
    {
      fields: ['island_template_id'],
    },
  ],
});

export { AdminIslandTemplate };
