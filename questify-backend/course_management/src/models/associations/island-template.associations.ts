import { IslandTemplate } from '../island-template';
import { Island } from '../island';

const defineIslandTemplateAssociations = () => {
  // Island Templates can be used by many islands
  IslandTemplate.hasMany(Island, {
    foreignKey: 'islandTemplateId',
    as: 'islands',
  });
};

export default defineIslandTemplateAssociations;
