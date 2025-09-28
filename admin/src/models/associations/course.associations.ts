import { Course } from '../course';
import { User } from '../user';
import { AdminCourse } from '../admin-course';

const defineCourseAssociations = () => {
  Course.hasMany(AdminCourse, {
    foreignKey: 'courseId',
    as: 'adminActions',
  });

  Course.belongsToMany(User, {
    through: AdminCourse,
    foreignKey: 'courseId',
    otherKey: 'adminId',
    as: 'admins',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  });
};

export default defineCourseAssociations;
