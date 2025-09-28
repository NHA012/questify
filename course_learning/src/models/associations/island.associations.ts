import { Island } from '../island';
import { Course } from '../course';
import { Level } from '../level';
import { PrerequisiteIsland } from '../prerequisite-island';
import { Reward } from '../reward';
import { User } from '../user';
import { UserIsland } from '../user-island';

const defineIslandAssociations = () => {
  Island.belongsTo(Course, { foreignKey: 'courseId' });
  Island.hasMany(Level, { foreignKey: 'islandId' });
  Island.belongsToMany(Island, {
    through: PrerequisiteIsland,
    foreignKey: 'islandId',
    otherKey: 'prerequisiteIslandId',
    as: 'prerequisites',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  });
  Island.belongsToMany(Island, {
    through: PrerequisiteIsland,
    foreignKey: 'prerequisiteIslandId',
    otherKey: 'islandId',
    as: 'islandsThatArePrerequisites',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  });
  Island.hasMany(Reward, { foreignKey: 'islandId' });
  Island.belongsToMany(User, {
    through: UserIsland,
    foreignKey: 'islandId',
    otherKey: 'userId',
    as: 'users',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  });
  Island.hasMany(UserIsland, { foreignKey: 'islandId' });
};

export default defineIslandAssociations;
