import { Model, DataTypes, Optional, ModelScopeOptions, ModelValidateOptions } from 'sequelize';
import { sequelize } from '../config/db';
import { User } from './user';
import { Course } from './course';
import { v4 as uuidv4 } from 'uuid';

const ReviewDefinition = {
  id: {
    allowNull: false,
    primaryKey: true,
    type: DataTypes.UUID,
    defaultValue: () => uuidv4(),
  },
  studentId: {
    allowNull: false,
    type: DataTypes.UUID,
    references: {
      model: User,
      key: 'id',
    },
  },
  courseId: {
    allowNull: false,
    type: DataTypes.UUID,
    references: {
      model: Course,
      key: 'id',
    },
  },
  comment: {
    allowNull: true,
    type: DataTypes.STRING,
  },
  rating: {
    allowNull: false,
    type: DataTypes.DECIMAL(2, 1),
    validate: {
      isDecimal: true,
      min: 1,
      max: 5,
      isValidStep(value: number) {
        const numValue = Number(value);
        const decimalPart = numValue % 1;
        if (decimalPart !== 0 && decimalPart !== 0.5) {
          throw new Error('Rating must be in increments of 0.5 (e.g., 1, 1.5, 2, 2.5, etc.)');
        }
      },
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

interface ReviewAttributes {
  id: string;
  studentId: string;
  courseId: string;
  comment?: string;
  rating: number;
  isDeleted: boolean;
  deletedAt?: Date;
}

type ReviewCreationAttributes = Optional<ReviewAttributes, 'id' | 'isDeleted'>;

class Review extends Model<ReviewAttributes, ReviewCreationAttributes> implements ReviewAttributes {
  public id!: string;
  public studentId!: string;
  public courseId!: string;
  public comment?: string;
  public rating!: number;
  public isDeleted!: boolean;
  public deletedAt?: Date;

  static readonly scopes: ModelScopeOptions = {};

  static readonly validations: ModelValidateOptions = {};
}

Review.init(ReviewDefinition, {
  sequelize,
  tableName: 'reviews',
  underscored: true,
  createdAt: true,
  updatedAt: true,
  defaultScope: {
    where: {
      isDeleted: false,
    },
  },
  scopes: Review.scopes,
  validate: Review.validations,
});

export { Review };
