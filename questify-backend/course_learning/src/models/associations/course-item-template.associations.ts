import { CourseItemTemplate } from '../course-item-template';
import { Course } from '../course';
import { ItemTemplate } from '../item-template';

const defineCourseItemTemplateAssociations = () => {
  CourseItemTemplate.belongsTo(Course, {
    foreignKey: 'course_id',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  });

  CourseItemTemplate.belongsTo(ItemTemplate, {
    foreignKey: 'item_template_id',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  });
};

export default defineCourseItemTemplateAssociations;
