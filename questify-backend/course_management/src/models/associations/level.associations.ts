import { Challenge } from '../challenge';
import { Island } from '../island';
import { Level } from '../level';

const defineLevelAssociations = () => {
  Level.belongsTo(Island, { foreignKey: 'islandId' });
  Level.hasOne(Challenge, { foreignKey: 'levelId', as: 'Challenge' });
};

export default defineLevelAssociations;
