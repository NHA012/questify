import { Model, DataTypes, Optional, ModelScopeOptions, ModelValidateOptions } from 'sequelize';
import { sequelize } from '../config/db';
import { Course } from './course';
import { ItemTemplate } from './item-template';
import { v4 as uuidv4 } from 'uuid';

const CourseItemTemplateDefinition = {
  id: {
    allowNull: false,
    primaryKey: true,
    type: DataTypes.UUID,
    defaultValue: () => uuidv4(),
  },
  course_id: {
    allowNull: false,
    type: DataTypes.UUID,
    references: {
      model: Course,
      key: 'id',
    },
  },
  item_template_id: {
    allowNull: false,
    type: DataTypes.UUID,
    references: {
      model: ItemTemplate,
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

interface CourseItemTemplateAttributes {
  id: string;
  course_id: string;
  item_template_id: string;
  isDeleted: boolean;
  deletedAt?: Date;
}

type CourseItemTemplateCreationAttributes = Optional<
  CourseItemTemplateAttributes,
  'id' | 'isDeleted' | 'deletedAt'
>;

class CourseItemTemplate
  extends Model<CourseItemTemplateAttributes, CourseItemTemplateCreationAttributes>
  implements CourseItemTemplateAttributes
{
  public id!: string;
  public course_id!: string;
  public item_template_id!: string;
  public isDeleted!: boolean;
  public deletedAt?: Date;

  static readonly scopes: ModelScopeOptions = {};

  static readonly validations: ModelValidateOptions = {};
}

CourseItemTemplate.init(CourseItemTemplateDefinition, {
  sequelize,
  tableName: 'course_item_templates',
  underscored: true,
  createdAt: true,
  updatedAt: true,
  defaultScope: {
    where: {
      isDeleted: false,
    },
  },
  scopes: CourseItemTemplate.scopes,
  validate: CourseItemTemplate.validations,
});

export { CourseItemTemplate };
