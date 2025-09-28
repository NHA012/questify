import { Model, DataTypes, Optional, ModelScopeOptions, ModelValidateOptions } from 'sequelize';
import { sequelize } from '../config/db';
import { User } from './user';
import { Course } from './course';
import { v4 as uuidv4 } from 'uuid';

const InventoryDefinition = {
  id: {
    allowNull: false,
    primaryKey: true,
    type: DataTypes.UUID,
    defaultValue: () => uuidv4(),
  },
  gold: {
    allowNull: false,
    type: DataTypes.INTEGER,
    defaultValue: 0,
    validate: {
      min: 0,
    },
  },
  user_id: {
    allowNull: false,
    type: DataTypes.UUID,
    references: {
      model: User,
      key: 'id',
    },
  },
  course_id: {
    allowNull: false,
    type: DataTypes.UUID,
    references: {
      model: Course,
      key: 'id',
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

interface InventoryAttributes {
  id: string;
  gold: number;
  user_id: string;
  course_id: string;
  isDeleted: boolean;
  deletedAt?: Date;
}

type InventoryCreationAttributes = Optional<
  InventoryAttributes,
  'id' | 'gold' | 'isDeleted' | 'deletedAt'
>;

class Inventory
  extends Model<InventoryAttributes, InventoryCreationAttributes>
  implements InventoryAttributes
{
  public id!: string;
  public gold!: number;
  public user_id!: string;
  public course_id!: string;
  public isDeleted!: boolean;
  public deletedAt?: Date;

  static readonly scopes: ModelScopeOptions = {};

  static readonly validations: ModelValidateOptions = {};
}

Inventory.init(InventoryDefinition, {
  sequelize,
  tableName: 'inventories',
  underscored: true,
  createdAt: true,
  updatedAt: true,
  defaultScope: {
    where: {
      isDeleted: false,
    },
  },
  scopes: Inventory.scopes,
  validate: Inventory.validations,
});

export { Inventory };
