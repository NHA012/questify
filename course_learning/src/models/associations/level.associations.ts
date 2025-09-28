import { Island } from '../island';
import { Level } from '../level';
import { Reward } from '../reward';
import { Hint } from '../hint';
import { Attempt } from '../attempt';
import { Challenge } from '../challenge';
import { User } from '../user';
import { UserLevel } from '../user-level';

const defineLevelAssociations = () => {
  Level.belongsTo(Island, { foreignKey: 'islandId' });
  Level.hasMany(Reward, { foreignKey: 'levelId' });
  Level.hasMany(Hint, { foreignKey: 'levelId' });
  Level.hasMany(Attempt, { foreignKey: 'levelId' });
  Level.hasOne(Challenge, { foreignKey: 'levelId' });
  Level.belongsToMany(User, {
    through: 'UserLevel',
    foreignKey: 'levelId',
    otherKey: 'userId',
    as: 'users',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  });
  Level.hasMany(UserLevel, { foreignKey: 'levelId' });
};

export default defineLevelAssociations;
