import { Attempt } from '../attempt';
import { Level } from '../level';
import { User } from '../user';
import { Feedback } from '../feedback';

const defineAttemptAssociations = () => {
  Attempt.belongsTo(Level, { foreignKey: 'levelId' });
  Attempt.belongsTo(User, { foreignKey: 'userId' });
  Attempt.hasOne(Feedback, { foreignKey: 'attemptId' });
};

export default defineAttemptAssociations;
