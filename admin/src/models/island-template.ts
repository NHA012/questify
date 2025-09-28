import { Model, DataTypes, Optional, ModelScopeOptions, ModelValidateOptions } from 'sequelize';
import { sequelize } from '../config/db';
import { v4 as uuidv4 } from 'uuid';

const IslandTemplateDefinition = {
  id: {
    allowNull: false,
    primaryKey: true,
    type: DataTypes.UUID,
    defaultValue: () => uuidv4(),
  },
  name: {
    allowNull: false,
    type: DataTypes.STRING,
    validate: {
      notEmpty: true,
    },
  },
  imageUrl: {
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

interface IslandTemplateAttributes {
  id: string;
  name: string;
  imageUrl: string;
  isDeleted: boolean;
  deletedAt?: Date;
}

type IslandTemplateCreationAttributes = Optional<
  IslandTemplateAttributes,
  'id' | 'isDeleted' | 'deletedAt'
>;

class IslandTemplate
  extends Model<IslandTemplateAttributes, IslandTemplateCreationAttributes>
  implements IslandTemplateAttributes
{
  public id!: string;
  public name!: string;
  public imageUrl!: string;
  public isDeleted!: boolean;
  public deletedAt?: Date;

  static readonly scopes: ModelScopeOptions = {};

  static readonly validations: ModelValidateOptions = {};
}

IslandTemplate.init(IslandTemplateDefinition, {
  sequelize,
  tableName: 'island_templates',
  underscored: true,
  createdAt: true,
  updatedAt: true,
  defaultScope: {
    where: {
      isDeleted: false,
    },
  },
  scopes: IslandTemplate.scopes,
  validate: IslandTemplate.validations,
});

export { IslandTemplate };
