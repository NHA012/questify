import { Message } from 'node-nats-streaming';
import { Subjects, Listener, UserCourseInventoryCreationEvent } from '@datn242/questify-common';
import { queueGroupName } from './queue-group-name';
import { Inventory } from '../../models/inventory';
import { CourseItemTemplate } from '../../models/course-item-template';
import { InventoryItemTemplate } from '../../models/inventory-item-template';

export class UserCourseInventoryCreationListener extends Listener<UserCourseInventoryCreationEvent> {
  subject: Subjects.UserCourseInventoryCreation = Subjects.UserCourseInventoryCreation;
  queueGroupName = queueGroupName;

  async onMessage(data: UserCourseInventoryCreationEvent['data'], msg: Message) {
    const { userId, courseId } = data;

    try {
      const inventory = await Inventory.create({
        user_id: userId,
        course_id: courseId,
        gold: 200,
      });

      const courseItemTemplates = await CourseItemTemplate.findAll({
        where: {
          course_id: courseId,
          isDeleted: false,
        },
      });

      for (const courseItemTemplate of courseItemTemplates) {
        await InventoryItemTemplate.create({
          inventory_id: inventory.id,
          item_template_id: courseItemTemplate.item_template_id,
          quantity: 0,
        });
      }

      msg.ack();
    } catch (error) {
      console.error(`Error creating inventory: ${error}`);
      msg.ack();
    }
  }
}
