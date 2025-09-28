import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../config/db';
import { User } from './user';
import { Course } from './course';
import { v4 as uuidv4 } from 'uuid';
import { CompletionStatus, EffectType } from '@datn242/questify-common';

const UserCourseDefinition = {
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
  point: {
    allowNull: false,
    type: DataTypes.INTEGER,
    defaultValue: 0,
    validate: {
      min: 0,
    },
  },
  completionStatus: {
    allowNull: false,
    type: DataTypes.ENUM(
      CompletionStatus.InProgress,
      CompletionStatus.Completed,
      CompletionStatus.Fail,
      CompletionStatus.Locked,
    ),
    defaultValue: CompletionStatus.InProgress,
  },
  finishedDate: {
    allowNull: true,
    type: DataTypes.DATE,
  },
  nextLevelEffect: {
    allowNull: true,
    type: DataTypes.STRING,
    validate: {
      isIn: [Object.values(EffectType)],
    },
    defaultValue: null,
  },
};

interface UserCourseAttributes {
  id: string;
  studentId: string;
  courseId: string;
  point: number;
  completionStatus: CompletionStatus;
  finishedDate?: Date;
  nextLevelEffect?: EffectType;

  user?: User;
}

type UserCourseCreationAttributes = Optional<UserCourseAttributes, 'id'>;

class UserCourse
  extends Model<UserCourseAttributes, UserCourseCreationAttributes>
  implements UserCourseAttributes
{
  public id!: string;
  public studentId!: string;
  public courseId!: string;
  public point!: number;
  public completionStatus!: CompletionStatus;
  public finishedDate?: Date;
  public nextLevelEffect?: EffectType;

  public User?: User;
}

UserCourse.init(UserCourseDefinition, {
  sequelize,
  tableName: 'user-courses',
  underscored: true,
  createdAt: true,
  updatedAt: true,
});

export { UserCourse };
