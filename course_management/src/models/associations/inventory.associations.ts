import { Inventory } from '../inventory';
import { User } from '../user';
import { Course } from '../course';
import { ItemTemplate } from '../item-template';
import { InventoryItemTemplate } from '../inventory-item-template';

const defineInventoryAssociations = () => {
  Inventory.belongsTo(User, {
    foreignKey: 'user_id',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  });

  Inventory.belongsTo(Course, {
    foreignKey: 'course_id',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  });

  Inventory.belongsToMany(ItemTemplate, {
    through: InventoryItemTemplate,
    foreignKey: 'inventory_id',
    otherKey: 'item_template_id',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  });

  Inventory.hasMany(InventoryItemTemplate, {
    foreignKey: 'inventory_id',
    onDelete: 'CASCADE',
  });
};

export default defineInventoryAssociations;
