import { Hint } from '../hint';
import { Level } from '../level';

const defineHintAssociations = () => {
  Hint.belongsTo(Level, { foreignKey: 'levelId' });
};

export default defineHintAssociations;
