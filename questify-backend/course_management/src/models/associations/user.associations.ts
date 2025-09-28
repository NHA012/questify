import { Course } from '../course';
import { User } from '../user';
import { Review } from '../review';
import { UserCourse } from '../user-course';
import { Inventory } from '../inventory';
import { UserRole } from '@datn242/questify-common';

const defineUserAssociations = () => {
  User.hasMany(Course, {
    foreignKey: 'teacherId',
    as: 'teacherCourses',
    constraints: false,
    scope: {
      role: UserRole.Teacher,
    },
  });
  User.hasMany(Review, { foreignKey: 'userId' });
  User.belongsToMany(Course, {
    through: UserCourse,
    foreignKey: 'studentId',
    otherKey: 'courseId',
    as: 'enrolledCourses',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    scope: {
      role: UserRole.Student,
    },
  });
  User.hasMany(UserCourse, {
    foreignKey: 'studentId',
  });
  User.hasMany(Inventory, {
    foreignKey: 'user_id',
    onDelete: 'CASCADE',
  });
};

export default defineUserAssociations;
