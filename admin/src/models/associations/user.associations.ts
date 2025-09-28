import { User } from '../user';
import { AdminUser } from '../admin-user';
import { AdminCourse } from '../admin-course';
import { AdminIslandTemplate } from '../admin-island-template';
import { Course } from '../course';
import { IslandTemplate } from '../island-template';

const defineUserAssociations = () => {
  User.hasMany(AdminUser, {
    foreignKey: 'adminId',
    as: 'adminActions',
  });

  User.hasMany(AdminUser, {
    foreignKey: 'userId',
    as: 'receivedAdminActions',
  });

  User.hasMany(AdminCourse, {
    foreignKey: 'adminId',
    as: 'courseActions',
  });

  User.hasMany(AdminIslandTemplate, {
    foreignKey: 'adminId',
    as: 'islandTemplateActions',
  });

  User.belongsToMany(User, {
    through: AdminUser,
    foreignKey: 'adminId',
    otherKey: 'userId',
    as: 'managedUsers',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  });

  User.belongsToMany(User, {
    through: AdminUser,
    foreignKey: 'userId',
    otherKey: 'adminId',
    as: 'adminUsers',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  });

  User.belongsToMany(Course, {
    through: AdminCourse,
    foreignKey: 'adminId',
    otherKey: 'courseId',
    as: 'managedCourses',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  });

  User.belongsToMany(IslandTemplate, {
    through: AdminIslandTemplate,
    foreignKey: 'adminId',
    otherKey: 'islandTemplateId',
    as: 'managedTemplates',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  });
};

export default defineUserAssociations;
