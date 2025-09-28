import { User } from '../user';
import { Feedback } from '../feedback';
import { Attempt } from '../attempt';

const defineFeedbackAssociations = () => {
  Feedback.belongsTo(User, { foreignKey: 'userId' });
  Feedback.belongsTo(Attempt, { foreignKey: 'attemptId' });
};

export default defineFeedbackAssociations;
