import { Island } from '../island';
import { PrerequisiteIsland } from '../prerequisite-island';

const definePrerequisiteIslandAssociations = () => {
  PrerequisiteIsland.belongsTo(Island, {
    foreignKey: 'islandId',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  });
  PrerequisiteIsland.belongsTo(Island, {
    foreignKey: 'prerequisiteIslandId',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  });
};

export default definePrerequisiteIslandAssociations;
