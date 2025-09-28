import { Model, DataTypes, Optional, ModelScopeOptions, ModelValidateOptions } from 'sequelize';
import { sequelize } from '../config/db';
import { v4 as uuidv4 } from 'uuid';
import { EffectType } from '@datn242/questify-common';

const ItemTemplateDefinition = {
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
  name: {
    allowNull: false,
    type: DataTypes.STRING,
    validate: {
      notEmpty: true,
    },
  },
  effect: {
    allowNull: false,
    type: DataTypes.STRING,
    validate: {
      isIn: [Object.values(EffectType)],
    },
  },
  effect_description: {
    allowNull: false,
    type: DataTypes.STRING,
  },
  img: {
    allowNull: false,
    type: DataTypes.STRING, // URL type
  },
  description: {
    allowNull: false,
    type: DataTypes.STRING,
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

interface ItemTemplateAttributes {
  id: string;
  gold: number;
  name: string;
  effect: EffectType;
  effect_description: string;
  img: string;
  description: string;
  isDeleted: boolean;
  deletedAt?: Date;
}

type ItemTemplateCreationAttributes = Optional<
  ItemTemplateAttributes,
  'id' | 'isDeleted' | 'deletedAt' | 'gold'
>;

class ItemTemplate
  extends Model<ItemTemplateAttributes, ItemTemplateCreationAttributes>
  implements ItemTemplateAttributes
{
  public id!: string;
  public gold!: number;
  public name!: string;
  public effect!: EffectType;
  public effect_description!: string;
  public img!: string;
  public description!: string;
  public isDeleted!: boolean;
  public deletedAt?: Date;

  static readonly scopes: ModelScopeOptions = {};

  static readonly validations: ModelValidateOptions = {};
}

ItemTemplate.init(ItemTemplateDefinition, {
  sequelize,
  tableName: 'item_templates',
  underscored: true,
  createdAt: true,
  updatedAt: true,
  defaultScope: {
    where: {
      isDeleted: false,
    },
  },
  scopes: ItemTemplate.scopes,
  validate: ItemTemplate.validations,
});

export { ItemTemplate };
