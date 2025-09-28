import { Message } from 'node-nats-streaming';
import { Subjects, Listener, CourseItemTemplateCreatedEvent } from '@datn242/questify-common';
import { queueGroupName } from './queue-group-name';
import { CourseItemTemplate } from '../../models/course-item-template';
import { Inventory } from '../../models/inventory';
import { InventoryItemTemplate } from '../../models/inventory-item-template';

export class CourseItemTemplateCreatedListener extends Listener<CourseItemTemplateCreatedEvent> {
  subject: Subjects.CourseItemTemplateCreated = Subjects.CourseItemTemplateCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: CourseItemTemplateCreatedEvent['data'], msg: Message) {
    const { id, courseId, itemTemplateId, isDeleted } = data;

    // First check if the CourseItemTemplate already exists
    const existingAssociation = await CourseItemTemplate.unscoped().findByPk(id);

    if (existingAssociation) {
      console.warn(`CourseItemTemplate with ID: ${id} already exists, skipping creation`);
      msg.ack();
      return;
    }

    // Create the CourseItemTemplate record with proper deletedAt handling
    const courseItemTemplate = CourseItemTemplate.build({
      id,
      course_id: courseId,
      item_template_id: itemTemplateId,
      isDeleted: isDeleted || false,
      // Set deletedAt explicitly based on isDeleted flag
      deletedAt: isDeleted ? new Date() : null,
    });

    await courseItemTemplate.save();

    // Now update inventory items for all students enrolled in this course
    // We only need to do this if the item template is not marked as deleted
    if (!isDeleted) {
      // Find all inventories for this course
      const inventories = await Inventory.findAll({
        where: {
          course_id: courseId,
          isDeleted: false,
        },
      });

      // For each inventory, create or reactivate the inventory item
      for (const inventory of inventories) {
        // Check if there's a soft-deleted inventory item that can be reactivated
        const existingSoftDeleted = await InventoryItemTemplate.findOne({
          where: {
            inventory_id: inventory.id,
            item_template_id: itemTemplateId,
            isDeleted: true,
          },
        });

        if (existingSoftDeleted) {
          // Reactivate soft-deleted inventory item with null for deletedAt
          await InventoryItemTemplate.update(
            {
              isDeleted: false,
              deletedAt: null, // Use null instead of undefined
            },
            {
              where: {
                id: existingSoftDeleted.id,
              },
            },
          );
        } else {
          // Check if an active inventory item already exists
          const existingActive = await InventoryItemTemplate.findOne({
            where: {
              inventory_id: inventory.id,
              item_template_id: itemTemplateId,
              isDeleted: false,
            },
          });

          // Only create a new one if it doesn't already exist
          if (!existingActive) {
            // Create new inventory item with initial quantity 0
            await InventoryItemTemplate.create({
              inventory_id: inventory.id,
              item_template_id: itemTemplateId,
              quantity: 0,
            });
          }
        }
      }
    }

    msg.ack();
  }
}
