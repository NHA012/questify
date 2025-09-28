import { Model, DataTypes, Optional, ModelScopeOptions, ModelValidateOptions } from 'sequelize';
import { sequelize } from '../config/db';
import { Inventory } from './inventory';
import { ItemTemplate } from './item-template';
import { v4 as uuidv4 } from 'uuid';

const InventoryItemTemplateDefinition = {
  id: {
    allowNull: false,
    primaryKey: true,
    type: DataTypes.UUID,
    defaultValue: () => uuidv4(),
  },
  inventory_id: {
    allowNull: false,
    type: DataTypes.UUID,
    references: {
      model: Inventory,
      key: 'id',
    },
  },
  item_template_id: {
    allowNull: false,
    type: DataTypes.UUID,
    references: {
      model: ItemTemplate,
      key: 'id',
    },
  },
  quantity: {
    allowNull: false,
    type: DataTypes.INTEGER,
    defaultValue: 1,
    validate: {
      min: 0,
    },
  },
  isDeleted: {
    allowNull: false,
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  deletedAt: {
    allowNull: true,
    type: DataTypes.DATE,
  },
};

interface InventoryItemTemplateAttributes {
  id: string;
  inventory_id: string;
  item_template_id: string;
  quantity: number;
  isDeleted: boolean;
  deletedAt?: Date | null;
}

type InventoryItemTemplateCreationAttributes = Optional<
  InventoryItemTemplateAttributes,
  'id' | 'quantity' | 'isDeleted' | 'deletedAt'
>;

class InventoryItemTemplate
  extends Model<InventoryItemTemplateAttributes, InventoryItemTemplateCreationAttributes>
  implements InventoryItemTemplateAttributes
{
  public id!: string;
  public inventory_id!: string;
  public item_template_id!: string;
  public quantity!: number;
  public isDeleted!: boolean;
  public deletedAt?: Date | null;

  static readonly scopes: ModelScopeOptions = {};

  static readonly validations: ModelValidateOptions = {};
}

InventoryItemTemplate.init(InventoryItemTemplateDefinition, {
  sequelize,
  tableName: 'inventory_item_templates',
  underscored: true,
  createdAt: true,
  updatedAt: true,
  defaultScope: {
    where: {
      isDeleted: false,
    },
  },
  scopes: InventoryItemTemplate.scopes,
  validate: InventoryItemTemplate.validations,
});

export { InventoryItemTemplate };
