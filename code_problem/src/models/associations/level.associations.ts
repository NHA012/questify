import { Level } from '../level';
import { User } from '../user';
import { CodeProblem } from '../code-problem';
import { UserLevel } from '../user-level';

const defineLevelAssociations = () => {
  Level.hasOne(CodeProblem, { foreignKey: 'levelId' });
  Level.belongsToMany(User, {
    through: UserLevel,
    foreignKey: 'levelId',
    otherKey: 'studentId',
    as: 'students',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  });
  Level.hasMany(UserLevel, { foreignKey: 'levelId' });
  Level.belongsTo(User, { foreignKey: 'teacherId' });
};

export default defineLevelAssociations;
