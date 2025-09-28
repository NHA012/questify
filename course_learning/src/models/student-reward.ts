import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../config/db';
// import { User } from './user';
// import { Reward } from './reward';

const StudentRewardDefinition = {
  userId: {
    allowNull: false,
    type: DataTypes.UUID,
    references: {
      model: 'users',
      key: 'id',
    },
  },
  rewardId: {
    allowNull: false,
    type: DataTypes.UUID,
    references: {
      model: 'rewards',
      key: 'id',
    },
  },
};

interface StudentRewardAttributes {
  id?: string;
  userId: string;
  rewardId: string;
}

type StudentRewardCreationAttributes = Optional<StudentRewardAttributes, 'id'>;

class StudentReward
  extends Model<StudentRewardAttributes, StudentRewardCreationAttributes>
  implements StudentRewardAttributes
{
  public userId!: string;
  public rewardId!: string;
}

StudentReward.init(StudentRewardDefinition, {
  sequelize,
  tableName: 'student_reward',
  underscored: true,
  createdAt: true,
  updatedAt: true,
});

export { StudentReward };
