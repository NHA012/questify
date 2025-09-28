import { User } from '../user';
import { Review } from '../review';
import { Course } from '../course';

const defineReviewAssociations = () => {
  Review.belongsTo(User, {
    foreignKey: 'userId',
  });
  Review.belongsTo(Course, {
    foreignKey: 'courseId',
  });
};

export default defineReviewAssociations;
