import { ItemTemplate } from '../item-template';
import { Course } from '../course';
import { Inventory } from '../inventory';
import { CourseItemTemplate } from '../course-item-template';
import { InventoryItemTemplate } from '../inventory-item-template';

const defineItemTemplateAssociations = () => {
  ItemTemplate.belongsToMany(Course, {
    through: CourseItemTemplate,
    foreignKey: 'item_template_id',
    otherKey: 'course_id',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  });

  ItemTemplate.belongsToMany(Inventory, {
    through: InventoryItemTemplate,
    foreignKey: 'item_template_id',
    otherKey: 'inventory_id',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  });

  ItemTemplate.hasMany(CourseItemTemplate, {
    foreignKey: 'item_template_id',
    onDelete: 'CASCADE',
  });

  ItemTemplate.hasMany(InventoryItemTemplate, {
    foreignKey: 'item_template_id',
    onDelete: 'CASCADE',
  });
};

export default defineItemTemplateAssociations;
