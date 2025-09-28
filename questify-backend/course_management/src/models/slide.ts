import { Model, DataTypes, Optional, ModelScopeOptions, ModelValidateOptions } from 'sequelize';
import { sequelize } from '../config/db';
import { v4 as uuidv4 } from 'uuid';
import { Challenge } from './challenge';
import { SlideType } from '@datn242/questify-common';

const SlideDefinition = {
  id: {
    allowNull: false,
    primaryKey: true,
    type: DataTypes.UUID,
    defaultValue: () => uuidv4(),
  },
  title: {
    allowNull: true,
    type: DataTypes.STRING,
  },
  description: {
    allowNull: true,
    type: DataTypes.STRING,
  },
  slideNumber: {
    allowNull: false,
    type: DataTypes.INTEGER,
  },
  type: {
    type: DataTypes.ENUM(...Object.values(SlideType)),
    allowNull: false,
  },
  imageUrl: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  videoUrl: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  answers: {
    type: DataTypes.ARRAY(DataTypes.JSON),
    allowNull: true,
  },
  challengeId: {
    allowNull: false,
    type: DataTypes.UUID,
    references: {
      model: Challenge,
      key: 'id',
    },
  },
  isDeleted: {
    allowNull: false,
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
};

interface Answer {
  content: string;
  isCorrect: boolean;
}

interface SlideAttributes {
  id: string;
  title?: string;
  description?: string;
  slideNumber: number;
  type: SlideType;
  imageUrl?: string;
  videoUrl?: string;
  answers?: Answer[];
  challengeId: string;
  isDeleted: boolean;
}

type SlideCreationAttributes = Optional<SlideAttributes, 'id' | 'isDeleted'>;

class Slide extends Model<SlideAttributes, SlideCreationAttributes> implements SlideAttributes {
  public id!: string;
  public title?: string;
  public description?: string;
  public slideNumber!: number;
  public type!: SlideType;
  public imageUrl?: string;
  public videoUrl?: string;
  public answers?: Answer[];
  public challengeId!: string;
  public isDeleted!: boolean;

  static readonly scopes: ModelScopeOptions = {};

  static readonly validations: ModelValidateOptions = {};
}

Slide.init(SlideDefinition, {
  sequelize,
  tableName: 'slides',
  underscored: true,
  createdAt: true,
  updatedAt: true,
  defaultScope: {
    where: {
      isDeleted: false,
    },
  },
  scopes: Slide.scopes,
  validate: Slide.validations,
});

export { Slide };
