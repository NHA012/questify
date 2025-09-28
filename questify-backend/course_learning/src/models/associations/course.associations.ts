import { Course } from '../course';
import { Island } from '../island';
import { User } from '../user';
import { Review } from '../review';
import { Reward } from '../reward';
import { Inventory } from '../inventory';
import { ItemTemplate } from '../item-template';
import { CourseItemTemplate } from '../course-item-template';
import { UserCourse } from '../user-course';

const defineCourseAssociations = () => {
  Course.belongsTo(User, {
    foreignKey: 'userId',
  });
  Course.hasMany(Island, { foreignKey: 'courseId' });
  Course.hasMany(Review, { foreignKey: 'courseId' });
  Course.hasMany(Reward, { foreignKey: 'courseId' });
  Course.belongsToMany(ItemTemplate, {
    through: CourseItemTemplate,
    foreignKey: 'course_id',
    otherKey: 'item_template_id',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  });

  Course.hasMany(CourseItemTemplate, {
    foreignKey: 'course_id',
    onDelete: 'CASCADE',
  });

  Course.hasMany(Inventory, {
    foreignKey: 'course_id',
    onDelete: 'CASCADE',
  });
  Course.hasMany(UserCourse, { foreignKey: 'courseId' });
};

export default defineCourseAssociations;
