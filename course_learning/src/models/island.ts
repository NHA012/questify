import { Model, DataTypes, Optional, ModelScopeOptions, ModelValidateOptions } from 'sequelize';
import { sequelize } from '../config/db';
import { Course } from './course';
import { v4 as uuidv4 } from 'uuid';

const IslandDefinition = {
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
  description: {
    allowNull: true,
    type: DataTypes.STRING,
  },
  position: {
    allowNull: false,
    type: DataTypes.INTEGER,
  },
  backgroundImage: {
    allowNull: true,
    type: DataTypes.STRING,
  },
  courseId: {
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
};

interface IslandAttributes {
  id: string;
  name: string;
  description?: string;
  position: number;
  backgroundImage?: string;
  courseId: string;
  isDeleted: boolean;
}

type IslandCreationAttributes = Optional<IslandAttributes, 'id' | 'isDeleted'>;
class Island extends Model<IslandAttributes, IslandCreationAttributes> implements IslandAttributes {
  public id!: string;
  public name!: string;
  public description?: string;
  public position!: number;
  public backgroundImage?: string;
  public courseId!: string;
  public isDeleted!: boolean;

  public getCourse!: () => Promise<Course>;

  static readonly scopes: ModelScopeOptions = {};

  static readonly validations: ModelValidateOptions = {};
}

Island.init(IslandDefinition, {
  sequelize,
  tableName: 'islands',
  underscored: true,
  createdAt: true,
  updatedAt: true,
  defaultScope: {
    where: {
      isDeleted: false,
    },
  },
  scopes: Island.scopes,
  validate: Island.validations,
});

export { Island };
