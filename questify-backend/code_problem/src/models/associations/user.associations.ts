import { User } from '../user';
import { Attempt } from '../attempt';
import { UserLevel } from '../user-level';
import { Level } from '../level';

const defineUserAssociations = () => {
  User.hasMany(Attempt, { foreignKey: 'userId' });
  User.belongsToMany(Level, {
    through: UserLevel,
    foreignKey: 'studentId',
    otherKey: 'levelId',
    as: 'levels',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  });
  User.hasMany(UserLevel, { foreignKey: 'studentId' });
};

export default defineUserAssociations;
