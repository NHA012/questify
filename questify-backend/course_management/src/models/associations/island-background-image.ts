import { IslandBackgroundImage } from '../island-background-image';
import { Island } from '../island';

const defineIslandBackgroundImageAssociations = () => {
  IslandBackgroundImage.hasMany(Island, {
    foreignKey: 'islandBackgroundImageId',
    as: 'islands',
  });
};

export default defineIslandBackgroundImageAssociations;
