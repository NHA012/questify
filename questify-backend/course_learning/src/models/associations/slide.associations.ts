import { Challenge } from '../challenge';
import { Slide } from '../slide';

const defineSlideAssociations = () => {
  Slide.belongsTo(Challenge, { foreignKey: 'challengeId' });
};

export default defineSlideAssociations;
