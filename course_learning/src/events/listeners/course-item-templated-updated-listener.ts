import { Message } from 'node-nats-streaming';
import { Subjects, Listener, CourseItemTemplateUpdatedEvent } from '@datn242/questify-common';
import { queueGroupName } from './queue-group-name';
import { CourseItemTemplate } from '../../models/course-item-template';
import { Inventory } from '../../models/inventory';
import { InventoryItemTemplate } from '../../models/inventory-item-template';

export class CourseItemTemplateUpdatedListener extends Listener<CourseItemTemplateUpdatedEvent> {
  subject: Subjects.CourseItemTemplateUpdated = Subjects.CourseItemTemplateUpdated;
  queueGroupName = queueGroupName;

  async onMessage(data: CourseItemTemplateUpdatedEvent['data'], msg: Message) {
    const { id, courseId, itemTemplateId, isDeleted } = data;

    // Update the CourseItemTemplate first
    const courseItemTemplate = await CourseItemTemplate.unscoped().findByPk(id);

    if (!courseItemTemplate) {
      console.warn(`CourseItemTemplate with ID: ${id} not found, creating instead`);

      const newAssociation = CourseItemTemplate.build({
        id,
        course_id: courseId,
        item_template_id: itemTemplateId,
        isDeleted: isDeleted || false,
        // Set deletedAt to null explicitly for new records that aren't deleted
        deletedAt: isDeleted ? new Date() : null,
      });

      await newAssociation.save();
    } else {
      courseItemTemplate.isDeleted = isDeleted || false;

      if (isDeleted) {
        courseItemTemplate.deletedAt = new Date();
      } else {
        // Use null instead of undefined to properly clear the field
        courseItemTemplate.deletedAt = null;
      }

      await courseItemTemplate.save();
    }

    // Now update inventory items for all students enrolled in this course
    // Find all inventories for this course
    const inventories = await Inventory.findAll({
      where: {
        course_id: courseId,
        isDeleted: false,
      },
    });

    // For each inventory, update the inventory items based on isDeleted flag
    for (const inventory of inventories) {
      if (isDeleted) {
        // If the course item template is being marked as deleted,
        // mark corresponding inventory items as deleted too
        await InventoryItemTemplate.update(
          {
            isDeleted: true,
            deletedAt: new Date(),
          },
          {
            where: {
              inventory_id: inventory.id,
              item_template_id: itemTemplateId,
              isDeleted: false,
            },
          },
        );
      } else {
        // If the course item template is being reactivated, check if there's a
        // soft-deleted inventory item that can be reactivated
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
