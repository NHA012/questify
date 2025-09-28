import { InventoryItemTemplate } from '../inventory-item-template';
import { Inventory } from '../inventory';
import { ItemTemplate } from '../item-template';

const defineInventoryItemTemplateAssociations = () => {
  InventoryItemTemplate.belongsTo(Inventory, {
    foreignKey: 'inventory_id',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  });

  InventoryItemTemplate.belongsTo(ItemTemplate, {
    foreignKey: 'item_template_id',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  });
};

export default defineInventoryItemTemplateAssociations;
