import { User } from '../user';
import { Island } from '../island';
import { UserIsland } from '../user-island';

const defineUserIslandAssociations = () => {
  UserIsland.belongsTo(User, {
    foreignKey: 'userId',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  });
  UserIsland.belongsTo(Island, {
    foreignKey: 'islandId',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  });
};

export default defineUserIslandAssociations;
