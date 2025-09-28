import { User } from '../user';
import { Course } from '../course';
import { UserCourse } from '../user-course';

const defineUserCourseAssociations = () => {
  UserCourse.belongsTo(User, {
    foreignKey: 'userId',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  });
  UserCourse.belongsTo(Course, {
    foreignKey: 'courseId',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  });
};

export default defineUserCourseAssociations;
