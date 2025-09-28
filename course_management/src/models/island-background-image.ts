import { Model, DataTypes, Optional, ModelScopeOptions, ModelValidateOptions } from 'sequelize';
import { sequelize } from '../config/db';
import { v4 as uuidv4 } from 'uuid';

const IslandBackgroundImageDefinition = {
  id: {
    allowNull: false,
    primaryKey: true,
    type: DataTypes.UUID,
    defaultValue: () => uuidv4(),
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

interface IslandBackgroundImageAttributes {
  id: string;
  imageUrl: string;
  isDeleted: boolean;
  deletedAt?: Date;
}

type IslandBackgroundImageCreationAttributes = Optional<
  IslandBackgroundImageAttributes,
  'id' | 'isDeleted' | 'deletedAt'
>;

class IslandBackgroundImage
  extends Model<IslandBackgroundImageAttributes, IslandBackgroundImageCreationAttributes>
  implements IslandBackgroundImageAttributes
{
  public id!: string;
  public imageUrl!: string;
  public isDeleted!: boolean;
  public deletedAt?: Date;

  static readonly scopes: ModelScopeOptions = {};

  static readonly validations: ModelValidateOptions = {};
}

IslandBackgroundImage.init(IslandBackgroundImageDefinition, {
  sequelize,
  tableName: 'island_background_images',
  underscored: true,
  createdAt: true,
  updatedAt: true,
  defaultScope: {
    where: {
      isDeleted: false,
    },
  },
  scopes: IslandBackgroundImage.scopes,
  validate: IslandBackgroundImage.validations,
});

export { IslandBackgroundImage };
