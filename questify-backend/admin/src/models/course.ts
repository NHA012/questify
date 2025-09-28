import { Model, DataTypes, Optional, ModelScopeOptions, ModelValidateOptions } from 'sequelize';
import { sequelize } from '../config/db';
import { User } from './user';
import { CourseStatus } from '@datn242/questify-common';
import { v4 as uuidv4 } from 'uuid';
import { CourseCategory } from '@datn242/questify-common';

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
  isDeleted: {
    allowNull: false,
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  deletedAt: {
    allowNull: true,
    type: DataTypes.DATE,
  },
  status: {
    allowNull: false,
    type: DataTypes.STRING,
    validate: {
      isIn: [Object.values(CourseStatus)],
    },
    defaultValue: CourseStatus.Pending,
  },
};

interface CourseAttributes {
  id: string;
  name: string;
  description?: string;
  category?: string;
  price?: number;
  thumbnail?: string;
  teacherId: string;
  isDeleted: boolean;
  deletedAt?: Date;
  status: CourseStatus;
}

type CourseCreationAttributes = Optional<CourseAttributes, 'id' | 'isDeleted' | 'deletedAt'>;

class Course extends Model<CourseAttributes, CourseCreationAttributes> implements CourseAttributes {
  public id!: string;
  public name!: string;
  public description?: string;
  public category?: string;
  public price?: number;
  public thumbnail?: string;
  public teacherId!: string;
  public isDeleted!: boolean;
  public deletedAt?: Date;
  public status!: CourseStatus;

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
