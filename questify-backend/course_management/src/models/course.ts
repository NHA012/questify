import { Model, DataTypes, Optional, ModelScopeOptions, ModelValidateOptions } from 'sequelize';
import { sequelize } from '../config/db';
import { User } from './user';
import { v4 as uuidv4 } from 'uuid';
import { CourseCategory, CourseStatus, EnvStage } from '@datn242/questify-common';

const isTest = process.env.NODE_ENV === EnvStage.Test;

const CourseDefinition = {
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
  shortDescription: {
    allowNull: true,
    type: DataTypes.STRING,
  },
  description: {
    allowNull: true,
    type: DataTypes.TEXT,
  },
  category: {
    allowNull: true,
    type: DataTypes.STRING,
    validator: {
      isIn: [Object.values(CourseCategory)],
    },
  },
  price: {
    allowNull: true,
    type: DataTypes.FLOAT,
    defaultValue: 0,
    validator: {
      min: 0,
    },
  },
  backgroundImage: {
    allowNull: true,
    type: DataTypes.TEXT,
  },
  thumbnail: {
    allowNull: true,
    type: DataTypes.TEXT,
  },
  learningObjectives: {
    allowNull: false,
    type: isTest ? DataTypes.JSON : DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: [],
  },
  requirements: {
    allowNull: false,
    type: isTest ? DataTypes.JSON : DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: [],
  },
  targetAudience: {
    allowNull: false,
    type: isTest ? DataTypes.JSON : DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: [],
  },
  teacherId: {
    allowNull: false,
    type: DataTypes.UUID,
    references: {
      model: User,
      key: 'id',
    },
  },
  status: {
    allowNull: false,
    type: DataTypes.STRING,
    validator: {
      isIn: [Object.values(CourseStatus)],
    },
    defaultValue: CourseStatus.Draft,
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

interface CourseAttributes {
  id: string; //
  name: string; //title
  shortDescription?: string; //description
  description?: string;
  category?: string; //
  price?: number; //
  learningObjectives?: string[];
  requirements?: string[];
  targetAudience?: string[];
  backgroundImage?: string;
  thumbnail?: string; //image
  status: CourseStatus; //
  teacherId: string; //
  isDeleted: boolean;
  deletedAt?: Date;
}

type CourseCreationAttributes = Optional<
  CourseAttributes,
  | 'id'
  | 'isDeleted'
  | 'deletedAt'
  | 'price'
  | 'learningObjectives'
  | 'requirements'
  | 'targetAudience'
  | 'status'
  | 'thumbnail'
  | 'backgroundImage'
>;

class Course extends Model<CourseAttributes, CourseCreationAttributes> implements CourseAttributes {
  public id!: string;
  public name!: string;
  public shortDescription?: string;
  public description?: string;
  public category?: string;
  public price?: number;
  public learningObjectives?: string[];
  public requirements?: string[];
  public targetAudience?: string[];
  public backgroundImage?: string;
  public thumbnail?: string;
  public status!: CourseStatus;
  public teacherId!: string;
  public isDeleted!: boolean;
  public deletedAt?: Date;

  static readonly scopes: ModelScopeOptions = {};

  static readonly validations: ModelValidateOptions = {};
}

Course.init(CourseDefinition, {
  sequelize,
  tableName: 'courses',
  underscored: true,
  createdAt: true,
  updatedAt: true,
  defaultScope: {
    where: {
      isDeleted: false,
    },
  },
  scopes: Course.scopes,
  validate: Course.validations,
});

export { Course };
