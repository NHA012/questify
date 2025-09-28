import { AdminCourse } from '../admin-course';
import { User } from '../user';
import { Course } from '../course';

const defineAdminCourseAssociations = () => {
  AdminCourse.belongsTo(User, {
    foreignKey: 'adminId',
    as: 'admin',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  });

  AdminCourse.belongsTo(Course, {
    foreignKey: 'courseId',
    as: 'course',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  });
};

export default defineAdminCourseAssociations;
