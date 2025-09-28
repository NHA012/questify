import { Model, DataTypes, Optional, ModelScopeOptions, ModelValidateOptions } from 'sequelize';
import { sequelize } from '../config/db';
import { User } from './user';
import { v4 as uuidv4 } from 'uuid';
import { CourseStatus } from '@datn242/questify-common';

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
      len: [2, 100] as [number, number],
    },
  },
  description: {
    allowNull: true,
    type: DataTypes.TEXT,
  },
  backgroundImage: {
    allowNull: true,
    type: DataTypes.TEXT,
  },
  thumbnail: {
    allowNull: true,
    type: DataTypes.TEXT,
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
  id: string;
  name: string;
  description?: string;
  backgroundImage?: string;
  thumbnail?: string;
  teacherId: string;
  status?: CourseStatus;
  isDeleted: boolean;
  deletedAt?: Date;
}

type CourseCreationAttributes = Optional<CourseAttributes, 'id' | 'isDeleted' | 'deletedAt'>;

class Course extends Model<CourseAttributes, CourseCreationAttributes> implements CourseAttributes {
  public id!: string;
  public name!: string;
  public description?: string;
  public backgroundImage?: string;
  public thumbnail?: string;
  public teacherId!: string;
  public status?: CourseStatus;
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
