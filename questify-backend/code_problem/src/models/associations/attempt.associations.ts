import { Attempt } from '../attempt';
import { User } from '../user';
import { Level } from '../level';

const defineAttemptAssociations = () => {
  Attempt.belongsTo(Level, { foreignKey: 'levelId' });
  Attempt.belongsTo(User, { foreignKey: 'userId' });
};

export default defineAttemptAssociations;
