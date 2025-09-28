import { Course } from '../course';
import { Island } from '../island';
import { Level } from '../level';
import { Feedback } from '../feedback';
import { User } from '../user';
import { Review } from '../review';
import { Reward } from '../reward';
import { StudentReward } from '../student-reward';
import { Attempt } from '../attempt';
import { Inventory } from '../inventory';
import { UserCourse } from '../user-course';
import { UserIsland } from '../user-island';
import { UserLevel } from '../user-level';

const defineUserAssociations = () => {
  User.hasMany(Course, { foreignKey: 'userId' });
  User.hasMany(Feedback, { foreignKey: 'userId' });
  User.hasMany(Review, { foreignKey: 'userId' });
  User.hasMany(Attempt, { foreignKey: 'userId' });
  User.hasMany(Inventory, {
    foreignKey: 'user_id',
    onDelete: 'CASCADE',
  });
  User.belongsToMany(Reward, {
    through: StudentReward,
    foreignKey: 'userId',
    otherKey: 'rewardId',
    as: 'rewards',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  });
  User.belongsToMany(Course, {
    through: UserCourse,
    foreignKey: 'userId',
    otherKey: 'courseId',
    as: 'courses',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  });
  User.hasMany(UserCourse, {
    foreignKey: 'userId',
  });
  User.belongsToMany(Island, {
    through: UserIsland,
    foreignKey: 'userId',
    otherKey: 'islandId',
    as: 'islands',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  });
  User.hasMany(UserIsland, {
    foreignKey: 'userId',
  });
  User.belongsToMany(Level, {
    through: UserLevel,
    foreignKey: 'userId',
    otherKey: 'levelId',
    as: 'levels',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  });
  User.hasMany(UserLevel, {
    foreignKey: 'userId',
  });
};

export default defineUserAssociations;
